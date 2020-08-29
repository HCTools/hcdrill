/*
!!! WARNING !!!

This is not used for a reason. That reason is:
it doesn't work.

It just doesn't decrypt properly.
*/
import forge from 'node-forge';

const password = 'fubvx788b46v';

export default async function (file: File): Promise<string> {
    const contents = await file.text();

    // split the file in 3 halves
    const splitContents = contents.split('.').map(forge.util.decode64);

    // derive a key
    const key = forge.pkcs5.pbkdf2(password, splitContents[0], 1000, 32, forge.md.sha256.create());

    // decrypt the file
    const decipher = forge.cipher.createDecipher('AES-GCM', key);

    decipher.start({ 
        iv: forge.util.createBuffer(splitContents[1]),
        tag: forge.util.createBuffer(splitContents[2].slice(splitContents[2].length - 16))
    });

    console.log(splitContents);

    decipher.update(forge.util.createBuffer(splitContents[2]));
    decipher.finish();

    console.log(decipher.output);

    return contents;
}
