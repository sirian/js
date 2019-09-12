import {Var} from "./Var";

export class Unicode {
    public static getSymbols(str: string) {
        return [...Var.stringify(str)];
    }

    public static getGraphemes(str: string): string[] {
        const re = /(\P{M}\p{M}*)/gu;
        return Var.stringify(str).match(re) || [];
    }

    public static isUTF8(source: string) {
        try {
            return source === decodeURIComponent(encodeURIComponent(source));
        } catch (e) {
            return false;
        }
    }

    public static stringToBytes(str: string) {
        str = Var.stringify(str);
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
    }

    public static bytesToString(buf: Uint8Array | number[]) {
        const res = [];
        let tmp = "";
        const end = buf.length;

        for (let i = 0; i < end; i++) {
            if (buf[i] <= 0x7F) {
                res.push(Unicode.decodeChar(tmp), String.fromCharCode(buf[i]));
                tmp = "";
            } else {
                tmp += "%" + buf[i].toString(16);
            }
        }

        res.push(Unicode.decodeChar(tmp));

        return res.join("");
    }

    protected static decodeChar(str: string) {
        try {
            return decodeURIComponent(str);
        } catch (err) {
            return String.fromCharCode(0xFFFD); // UTF 8 invalid char
        }
    }
}
