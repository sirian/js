import {base64Chars} from "./const";

const revLookup = (b64: string, index: number) => {
    const char = b64[index];
    if ("-" === char) {
        return 62;
    }
    if ("_" === char) {
        return 63;
    }
    return base64Chars.indexOf(char);
};

export const base64Decode = (b64: string): Uint8Array => {
    let length = b64.length;
    if (!length) {
        return new Uint8Array();
    }

    while (length % 4 > 0) {
        b64 += "=";
        length++;
    }

    const placeHolders = "=" === b64[length - 2] ? 2 : +("=" === b64[length - 1]);
    const byteLength = (length * 3 / 4) - placeHolders;

    const bytes = new Uint8Array(byteLength);

    // if there are placeholders, only get up to the last complete 4 chars
    const l = placeHolders > 0 ? length - 4 : length;
    const rev = (index: number) => revLookup(b64, index);

    let i = 0;
    let k = 0;
    let tmp;
    const mask = 0xFF;
    for (; i < l; i += 4) {
        tmp = 0
            | (rev(i) << 18)
            | (rev(i + 1) << 12)
            | (rev(i + 2) << 6)
            | (rev(i + 3))
        ;
        bytes[k++] = mask & (tmp >> 16);
        bytes[k++] = mask & (tmp >> 8);
        bytes[k++] = mask & (tmp);
    }

    if (placeHolders === 1) {
        tmp = 0
            | (rev(i) << 10)
            | (rev(i + 1) << 4)
            | (rev(i + 2) >> 2);

        bytes[k++] = mask & (tmp >> 8);
        bytes[k++] = mask & (tmp);
    }
    if (placeHolders === 2) {
        tmp = 0
            | (rev(i) << 2)
            | (rev(i + 1) >> 4);

        bytes[k++] = mask & (tmp);
    }

    return bytes;
};
