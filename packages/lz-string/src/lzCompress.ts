/* eslint-disable unicorn/no-null */
export const lzCompress = (input?: string | null) => {
    if (input == null) {
        return new Uint8Array();
    }

    const bitsPerChar = 8;
    const dictionaryToCreate = new Set();
    const dictionary = new Map<string, number>();
    const resultBytes: number[] = [];
    let enlargeIn = 2;
    let dictSize = 3;
    let numBits = 2;
    let position = 0;
    let val = 0;
    let w = "";

    const decEnlarge = () => enlargeIn = (enlargeIn - 1) || (2 ** numBits++);

    const writeBit = (value: number) => {
        val = (val << 1) | (value & 1);
        if (position === bitsPerChar - 1) {
            resultBytes.push(val);
            position = 0;
            val = 0;
        } else {
            position++;
        }
    };

    const writeBits = (nBits: number, value: number) => {
        for (let i = 0; i < nBits; i++) {
            writeBit(value);
            value = value >> 1;
        }
    };

    const produceW = () => {
        if (!dictionaryToCreate.has(w)) {
            writeBits(numBits, dictionary.get(w)!);
        } else {
            const code = w.charCodeAt(0);
            writeBits(numBits, code < 256 ? 0 : 1);
            writeBits(code < 256 ? 8 : 16, code);
            decEnlarge();
            dictionaryToCreate.delete(w);
        }
        decEnlarge();
    };

    for (let i = 0; i < input.length; i += 1) {
        const c = input.charAt(i);

        if (!dictionary.has(c)) {
            dictionary.set(c, dictSize++);
            dictionaryToCreate.add(c);
        }

        const wc = w + c;

        if (dictionary.has(wc)) {
            w = wc;
        } else {
            produceW();
            dictionary.set(wc, dictSize++);
            w = c;
        }
    }

    if (w !== "") {
        produceW();
    }

    writeBits(numBits, 2);

    do {
        writeBit(0);
    } while (position);

    return new Uint8Array(resultBytes);
};
