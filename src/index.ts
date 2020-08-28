import { decryptionMethods, fillSelectWithMethods } from './decrypt';

const form = document.getElementById('input-form') as HTMLFormElement;
const resultBox = document.getElementById('decryption-result');

const methodSelect = document.getElementById('method') as HTMLSelectElement;

form.onsubmit = function(event: Event) {
    event.preventDefault();

    const options = new FormData(form);
    
    const method = decryptionMethods[options.get('method') as string];
    const file = options.get('file') as File;

    resultBox.style.color = 'var(--foreground)';

    method.func(file)
        .then((decryptedFile: string) => resultBox.innerText = decryptedFile)
        .catch((err: Error) => {
            resultBox.style.color = 'var(--foreground-error)';
            resultBox.innerText = err.message;
        });
}

fillSelectWithMethods(methodSelect);
