import {base64Normalize} from "./base64Normalize";
import {base64Chars} from "./const";

const revLookup = (b64: string, index: number) => base64Chars.indexOf(b64[index]);

export const base64Decode = (b64: string): Uint8Array => {
    const rawLength = b64.length;
    if (!rawLength) {
        return new Uint8Array();
    }
    b64 = base64Normalize(b64);

    const extra = rawLength & 3;

    if (extra > 0) {
        b64 += 2 === extra ? "==" : "=";
    }

    const length = b64.length;

    const placeHolders = "=" === b64[length - 2] ? 2 : ("=" === b64[length - 1] ? 1 : 0);
    const byteLength = (length * 3 / 4) - placeHolders;

    const bytes = new Uint8Array(byteLength);

    // if there are placeholders, only get up to the last complete 4 chars
    const l = placeHolders > 0 ? length - 4 : length;
    // eslint-disable-next-line unicorn/no-null
    const rev = revLookup.bind(null, b64);

    let i = 0;
    let k = -1;
    let tmp;
    const mask = 0xFF;
    for (; i < l; i += 4) {
        tmp = 0
            | (rev(i) << 18)
            | (rev(i + 1) << 12)
            | (rev(i + 2) << 6)
            | (rev(i + 3))
        ;
        bytes[++k] = mask & (tmp >> 16);
        bytes[++k] = mask & (tmp >> 8);
        bytes[++k] = mask & (tmp);
    }

    if (1 === placeHolders) {
        tmp = 0
            | (rev(i) << 10)
            | (rev(i + 1) << 4)
            | (rev(i + 2) >> 2);

        bytes[++k] = mask & (tmp >> 8);
        bytes[++k] = mask & (tmp);
    }
    if (2 === placeHolders) {
        tmp = 0
            | (rev(i) << 2)
            | (rev(i + 1) >> 4);

        bytes[++k] = mask & (tmp);
    }

    return bytes;
};
