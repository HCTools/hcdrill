import deobfuscate from './deobfuscate';
import decrypt from './decrypt';

const fileSelector = document.getElementById('encrypted-file-selector');
const resultBox = document.getElementById('decryption-result');

const keyList: [string, boolean][] = [
    ['hc_reborn_tester', true],
    ['hc_reborn_for_you', true],
    ['hc_reborn_7', true],
    ['hc_reborn_6', true],
    ['hc_reborn_5', true],
    ['hc_reborn_4', true],
    ['hc_reborn_3', true],
    ['hc_reborn_2', true],
    ['hc_reborn_1', true],
    ['hc_reborn___7', true],
    ['hc_reborn10', false],
    ['hc_reborn9', false],
    ['hc_reborn8', false],
    ['hc_reborn7', false],
    ['keY_secReaT_hc', false],
    ['keY_secReaT_hc1', false],
    ['keY_secReaT_hc2', false],
    ['keY_secReaT_hc_reborn', false],
    ['keY_secReaT_hc_reborn1', false],
    ['keY_secReaT_hc_2', false],
    ['keY_secReaT_hc_reborn3', false],
    ['keY_secReaT_hc_reborn4', false],
    ['keY_secReaT_hc_reborn5', false],
    ['keY_secReaT_hc_reborn6', false],
    ['keY_secReaT_te4Z9', false],
    ['keY_secReaT_te4Z10', false],
    ['keY_secReaT_te4Z11', false],
];

const noDice = 'NO DICE';

async function readAndDecryptFile(file: File) {
    // read the file and turn it into an array
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
                decryptedContents = decrypt(contents, key[0]);
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
}

fileSelector.onchange = (event: Event) => {
    const target = event.target as HTMLInputElement;

    resultBox.style.color = 'var(--foreground)';

    // decrypt the file
    readAndDecryptFile(target.files[0])
        .then((contents: string) => resultBox.innerText = contents)
        .catch((err: Error) => {
            // show the error
            resultBox.style.color = 'var(--foreground-error)';
            resultBox.innerText = err.message;
        });

    // show the decrypting... text
    resultBox.innerText = 'Decrypting...';
}
