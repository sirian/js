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

export function base64Decode(b64: string): Uint8Array {
    if (!b64.length) {
        return new Uint8Array();
    }

    while (b64.length % 4 > 0) {
        b64 += "=";
    }

    const length = b64.length;

    const placeHolders = "=" === b64[length - 2] ? 2 : +("=" === b64[length - 1]);
    const byteLength = (length * 3 / 4) - placeHolders;

    const bytes = new Uint8Array(byteLength);

    // if there are placeholders, only get up to the last complete 4 chars
    const l = placeHolders > 0 ? length - 4 : length;
    const rev = revLookup.bind(null, b64);

    let i = 0;
    let k = 0;
    for (; i < l; i += 4) {
        const tmp = 0
            | (rev(i) << 18)
            | (rev(i + 1) << 12)
            | (rev(i + 2) << 6)
            | (rev(i + 3))
        ;
        bytes[k++] = 0xFF & (tmp >> 16);
        bytes[k++] = 0xFF & (tmp >> 8);
        bytes[k++] = 0xFF & (tmp);
    }

    if (placeHolders === 1) {
        const tmp = 0
            | (rev(i) << 10)
            | (rev(i + 1) << 4)
            | (rev(i + 2) >> 2);

        bytes[k++] = 0xFF & (tmp >> 8);
        bytes[k++] = 0xFF & (tmp);
    } else if (placeHolders === 2) {
        const tmp = 0
            | (rev(i) << 2)
            | (rev(i + 1) >> 4);

        bytes[k++] = 0xFF & (tmp);
    }

    return bytes;
}
