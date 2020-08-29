type TR = HTMLTableRowElement;
type TD = HTMLTableDataCellElement;

// cursed function to convert records (aka an object in JS) to a bunch of HTML table rows
export function recordsToHTMLTableRows(
    records: Record<string, any>, 
    layerOfRecursion: number = 0, 
    humanFriendlyNames: Record<string, string> = {}
): TR[] {
    return Object.entries(records).map(([key, value]: [string, any], idx: number, arr: [string, any][]): TR[] => {
        const tr = document.createElement('tr');

        const blockPrefix = layerOfRecursion > 0
            ? (layerOfRecursion > 1 
                ? new Array(layerOfRecursion).fill(' ').join('') 
                : ''
              ) + (idx  === arr.length - 1 
                ? '└' 
                : '├'
              ) + ' '
            : '';

        const displayedName = blockPrefix + (humanFriendlyNames[key] ? humanFriendlyNames[key] : key);

        if(typeof value == 'object') {
            tr.insertCell().innerText = displayedName;

            return [tr, recordsToHTMLTableRows(value, layerOfRecursion + 1, humanFriendlyNames)].flat();
        }

        [key, value]
            .map((): TD => tr.insertCell())
            .map((cell: TD, idx: number): TD => cell.innerText = idx ? value : displayedName);

        return [tr];
    }).flat();
}
