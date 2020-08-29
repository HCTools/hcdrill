import HTTPCustom from './methods/http-custom';
// import decryptTunneltweak from './methods/tunneltweak';

export interface MetadataInterface {
    humanName: string
}

export interface DecryptInteface {
    decrypt: (File) => Promise<string>,
    parse?: (string) => Promise<string>,
}

export const decryptionMethods: DecryptInteface[] = [
    HTTPCustom,
];
