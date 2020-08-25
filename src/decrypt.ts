import UTF8 from 'crypto-js/enc-utf8';
import Hex from 'crypto-js/enc-hex';

import SHA1 from 'crypto-js/sha1';

import AES from 'crypto-js/aes';
import ECB from 'crypto-js/mode-ecb';

export default function (contents: string, key: string): string {
    // make a decryption key (multiplying 16 * 2 was required because it's impossible to
    // splice WordArrays for some reason)
    const decryptionKey = Hex.parse(SHA1(key).toString(Hex).substr(0, 16 * 2));

    // decrypt the file and return the result
    return AES.decrypt(
        contents, decryptionKey, { mode: ECB }
    ).toString(UTF8);
}
