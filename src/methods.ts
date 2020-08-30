import HTTPCustom from './methods/http-custom';
// import decryptTunneltweak from './methods/tunneltweak';

export interface MetadataInterface {
    humanName: string
}

export interface DecryptInteface {
    decrypt: (File) => Promise<string>,
}

export interface ParseInterface {
    parse?: (string) => Promise<Record<string, any>>,
}

type DecodeInterface = MetadataInterface & DecryptInteface & ParseInterface;

export const decryptionMethods: DecodeInterface[] = [
    HTTPCustom,
];
