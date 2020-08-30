import UTF8, { parse } from 'crypto-js/enc-utf8';
import Hex from 'crypto-js/enc-hex';

import SHA1 from 'crypto-js/sha1';

import AES from 'crypto-js/aes';
import ECB from 'crypto-js/mode-ecb';

import keyList from './http-custom-keys.json';

const xorList = [
    '。', '〃', '〄', '々', '〆', '〇', '〈', '〉', '《', '》', 
    '「', '」', '『', '』', '【', '】', '〒', '〓', '〔', '〕'
];

const noDice = 'NO DICE';

const zip = (ks, vs) => ks.reduce((acc, k, i) => (acc[k] = vs[i], acc), {});

const schema = [
    'payloadURL',
    'payloadProxyURL',
    'blockRoot',
    'lockPayloadAndServers',
    'expiryDate',
    'hasNotes',
    'noteField1',
    'sshAddress',
    'onlyMobileData',
    'unlockProxy',
    'unknown',
    'vpnAddress',
    'sslSNI',
    'shouldConnectViaSSH',
    'lockPayload',
    'udpgwPort',
    'hasHWID',
    'hwid'
];

function deobfuscate(contents: string): string {
    const obfuscatedContents = contents.split('')
        .map((char: string): number => char.charCodeAt(0));

    // deobfuscate the file
    return String.fromCharCode(
        ...obfuscatedContents.map((byte: number, idx: number): number =>
            byte ^ xorList[idx % xorList.length].charCodeAt(0))
    );
}

function decryptFileWithKey(contents: string, key: string): string {
    // make a decryption key (multiplying 16 * 2 was required because it's impossible to
    // splice WordArrays for some reason)
    const decryptionKey = Hex.parse(SHA1(key).toString(Hex).substr(0, 16 * 2));

    // decrypt the file and return the result
    return AES.decrypt(
        contents, decryptionKey, { mode: ECB }
    ).toString(UTF8);
}

export default {
    humanName: 'HTTP Custom',

    async decrypt(file: File): Promise<string> {
        const encryptedContents = await file.text();
    
        // deobfuscate the contents
        const deobfuscatedContents = deobfuscate(encryptedContents);
    
        // pick a key for the file and try to decrypt it
        const decryptedContents = keyList.reduce<string>(
            (prevSuccsessfulAttempt: string, key: [string, boolean], idx: number): string => {
                // decide what contents should we use
                let contents = key[1] ? deobfuscatedContents : encryptedContents;
                let decryptedContents: string;
    
                try {
                    // try to decrypt the contents
                    // (this will fail with a UTF-8 decode error if the key is invalid)
                    decryptedContents = decryptFileWithKey(contents, key[0]);
                } catch (err) {
                    if(err.message.match(/^Malformed .* data$/)) {
                        return prevSuccsessfulAttempt;
                    }
                    
                    throw err;
                }
                
                return decryptedContents;
            }, 
        noDice);
    
        // if NONE of the keys worked
        if(decryptedContents === noDice) {
            // error out
            throw new Error('Decryption failed. Maybe it\'s encrypted in a way that is\'nt yet supported.');
        }
    
        return decryptedContents;
    },

    async parse(contents: string): Promise<Record<string, any>> {
        const splitContents = contents.split('[splitConfig]');
        const rawMap = zip(schema, splitContents);

        return {
            'connectionType': rawMap['shouldConnectViaSSH'] ? 'SSH' : 'VPN',
            'address': rawMap['shouldConnectViaSSH'] === 'true' ? rawMap['sshAddress'] : rawMap['vpnAddress'],

            'payload': {
                'url': rawMap['payloadURL'],
                'proxyURL': rawMap['payloadProxyURL']
            },

            'sslSNI': rawMap['sslSNI'],

            'notes': {
                1: rawMap['noteField1'], 
                2: rawMap['noteField2']
            },

            'expiryDate': rawMap['expiryDate'],
            'blockRoot': rawMap['blockRoot'],
        };
    }
}
