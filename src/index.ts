import { decryptionMethods } from './methods';

import { switchToScreen, optionsFromMethods } from './ui';
import { recordsToHTMLTableRows } from './ui/table';

const form = document.getElementById('input-form') as HTMLFormElement;
const resultBox = document.getElementById('decryption-result');
const resultTable = document.getElementById('result-table');

const methodSelect = document.getElementById('method') as HTMLSelectElement;

form.onsubmit = function(event: Event) {
    event.preventDefault();

    const options = new FormData(form);
    
    const method = decryptionMethods[parseInt(options.get('method') as string)];
    const file = options.get('file') as File;

    resultBox.style.color = 'var(--foreground)';

    method.decrypt(file)
        .then((decryptedFile: string) => {
            resultBox.innerText = decryptedFile;

            method.parse(decryptedFile).then((contents: Record<string, any>) => {
                const trs = recordsToHTMLTableRows(contents);

                trs.forEach((node: Node) => resultTable.appendChild(node));
            });
        })
        .catch((err: Error) => {
            resultBox.style.color = 'var(--foreground-error)';
            resultBox.innerText = err.message;
        });

    switchToScreen('result-screen');
}

optionsFromMethods(decryptionMethods).forEach((node: Node) => methodSelect.appendChild(node));

switchToScreen('input-screen');
