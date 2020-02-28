import {stringifyVar} from "./Var";

const byteToChar = [...Array(256)].map((x, i) => String.fromCharCode(i));
const byteToUriEncoded = [...Array(256)].map((x, i) => "%" + i.toString(16));
const invalidChar = String.fromCharCode(0xFFFD);
const decodeChar = decodeURIComponent;

export const bytesToString = (bytes: Uint8Array | ArrayLike<number>) => {
    const res = [];
    let tmp = "";
    let char;

    const end = bytes.length;

    for (let i = 0; i < end; i++) {
        const byte = bytes[i];
        if (byte <= 0x7F) {

            try {
                char = decodeChar(tmp);
            } catch (e) {
                char = invalidChar;
            }
            res.push(char, byteToChar[byte]);
            tmp = "";
        } else {
            tmp += byteToUriEncoded[byte];
        }
    }
    try {
        char = decodeChar(tmp);
    } catch (e) {
        char = invalidChar;
    }
    res.push(char);

    return res.join("");
};

export const stringToBytes = (str: string) => {
    str = stringifyVar(str);
    const length = str.length;
    const resArr = [];

    for (let point = 0, nextCode = 0, i = 0; i !== length;) {
        point = str.charCodeAt(i);
        ++i;

        if (point >= 0xD800 && point <= 0xDBFF) {
            if (i === length) {
                resArr.push(0xEF, 0xBF, 0xBD);
                break;
            }

            // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            nextCode = str.charCodeAt(i);

            if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
                ++i;

                point = (point - 0xD800) * 0x400 + nextCode - 0xDC00 + 0x10000;

                if (point > 0xFFFF) {
                    resArr.push(
                        (0x1E << 3) | (point >>> 18),
                        (0x2 << 6) | ((point >>> 12) & 0x3F),
                        (0x2 << 6) | ((point >>> 6) & 0x3F),
                        (0x2 << 6) | (point & 0x3F),
                    );
                    continue;
                }
            } else {
                resArr.push(0xEF, 0xBF, 0xBD);
                continue;
            }
        }
        if (point <= 0x007f) {
            resArr.push((0x0 << 7) | point);
        } else if (point <= 0x07FF) {
            resArr.push(
                (0x6 << 5) | (point >>> 6),
                (0x2 << 6) | (point & 0x3F),
            );
        } else {
            resArr.push(
                (0xE << 4) | (point >>> 12),
                (0x2 << 6) | ((point >>> 6) & 0x3F),
                (0x2 << 6) | (point & 0x3F),
            );
        }
    }
    return new Uint8Array(resArr);
};

export const isUTF8String = (source: string) => {
    try {
        return source === decodeURIComponent(encodeURIComponent(source));
    } catch (e) {
        return false;
    }
};
