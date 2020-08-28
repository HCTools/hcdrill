import decryptHTTPCustom from './methods/http-custom';

interface DecryptionMethod {
    humanName: string,
    func: (file: File) => Promise<string>,
}

export const decryptionMethods: Record<string, DecryptionMethod> = { 
    httpCustom: { humanName: 'HTTP Custom', func: decryptHTTPCustom } 
}

export function fillSelectWithMethods(elem: HTMLSelectElement): HTMLSelectElement {
    for(const methodID in decryptionMethods) {
        const optionElem = document.createElement('option');

        optionElem.innerText = decryptionMethods[methodID].humanName;
        optionElem.value = methodID;

        elem.appendChild(optionElem);
    }

    return elem;
}
