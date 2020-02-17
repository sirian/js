import {ByteArray} from "@sirian/common";
import {chars} from "./chars";

export function base64Decode(b64: string): ByteArray {
    const length = b64.length;

    if (length % 4 > 0) {
        throw new Error(`Invalid string "${b64}". Length must be a multiple of 4`);
    }

    const placeHolders = "=" === b64[length - 2] ? 2 : ("=" === b64[length - 1] ? 1 : 0);

    const byteLength = (length * 3 / 4) - placeHolders;
    const bytes = new ByteArray(byteLength);

    // if there are placeholders, only get up to the last complete 4 chars
    const l = placeHolders > 0 ? length - 4 : length;

    let L = 0;

    const rev = (index: number) => {
        const char = b64[index];
        if (char === "-") {
            return 62;
        }
        if (char === "_") {
            return 63;
        }
        return chars.indexOf(char);
    };

    let i = 0;

    for (; i < l; i += 4) {
        const tmp = 0
            | (rev(i) << 18)
            | (rev(i + 1) << 12)
            | (rev(i + 2) << 6)
            | (rev(i + 3))
        ;

        bytes[L++] = 0xFF & (tmp >> 16);
        bytes[L++] = 0xFF & (tmp >> 8);
        bytes[L++] = 0xFF & (tmp);
    }

    switch (placeHolders) {
        case 1: {
            const tmp = 0
                | (rev(i) << 10)
                | (rev(i + 1) << 4)
                | (rev(i + 2) >> 2);

            bytes[L++] = 0xFF & (tmp >> 8);
            bytes[L++] = 0xFF & (tmp);
            break;
        }
        case 2: {
            const tmp = 0
                | (rev(i) << 2)
                | (rev(i + 1) >> 4);

            bytes[L++] = 0xFF & (tmp);
            break;
        }
    }

    return bytes;
}
