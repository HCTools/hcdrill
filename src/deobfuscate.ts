export const xorList: string[] = [
    '。', '〃', '〄', '々', '〆', '〇', '〈', '〉', '《', '》', 
    '「', '」', '『', '』', '【', '】', '〒', '〓', '〔', '〕'
];

export default function (contents: string): string {
    const obfuscatedContents = contents.split('')
        .map((char: string): number => char.charCodeAt(0));

    // deobfuscate the file
    return String.fromCharCode(
        ...obfuscatedContents.map((byte: number, idx: number): number =>
            byte ^ xorList[idx % xorList.length].charCodeAt(0))
    );
}
