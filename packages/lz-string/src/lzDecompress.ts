export function lzDecompress(bytes?: Uint8Array | null) {
    if (null == bytes) {
        return "";
    }

    if (!bytes.length) {
        return null;
    }

    const resetValue = 128;
    let enlargeIn = 4;
    let numBits = 3;
    let index = 1;
    let position = resetValue;
    let val: number = bytes[0];
    const dictionary: string[] = ["1", "2", "3"];

    const updateEnlarge = () => {
        if (!enlargeIn) {
            enlargeIn = 2 ** numBits;
            numBits++;
        }
    };

    const readBit = () => {
        const res = val & position;
        position >>= 1;

        if (!position) {
            position = resetValue;
            val = bytes[index++];
        }

        return res > 0 ? 1 : 0;
    };

    const readBits = (nBits: number) => {
        let bits = 0;
        const maxPower = 2 ** nBits;

        for (let power = 1; power !== maxPower; power *= 2) {
            bits |= readBit() * power;
        }

        return bits;
    };

    const next = readBits(2);

    const result = [];
    if (next !== 0 && next !== 1) {
        return "";
    }

    let w = String.fromCharCode(readBits(next ? 16 : 8));

    dictionary.push(w);
    result.push(w);

    while (true) {
        if (index > bytes.length) {
            return "";
        }

        const bits = readBits(numBits);

        if (2 === bits) {
            break;
        }
        let c = bits;

        if (0 === bits || 1 === bits) {
            const char = String.fromCharCode(readBits(bits ? 16 : 8));
            c = dictionary.length;
            dictionary.push(char);
            enlargeIn--;
        }

        updateEnlarge();

        let entry;
        if (c < dictionary.length) {
            entry = dictionary[c];
        } else if (c === dictionary.length) {
            entry = w + w.charAt(0);
        } else {
            return null;
        }

        result.push(entry);
        // Add w+entry[0] to the dictionary.
        dictionary.push(w + entry.charAt(0));
        w = entry;

        enlargeIn--;
        updateEnlarge();
    }

    return result.join("");
}
