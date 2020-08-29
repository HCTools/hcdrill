import HTTPCustom from './methods/http-custom';
// import decryptTunneltweak from './methods/tunneltweak';

export interface IMetadata {
    humanName: string
}

export interface IDecrypt extends IMetadata {
    decrypt: (file: File) => Promise<string>,
}

export const decryptionMethods: IDecrypt[] = [
    HTTPCustom,
];

export function fillSelectWithMethods(elem: HTMLSelectElement, methods: IDecrypt[]): HTMLSelectElement {
    for(const methodID in decryptionMethods) {
        const optionElem = document.createElement('option');

        optionElem.innerText = decryptionMethods[methodID].humanName;
        optionElem.value = methodID;

        elem.appendChild(optionElem);
    }

    return elem;
}
