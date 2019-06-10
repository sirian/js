import {Unicode} from "@sirian/unicode";
import {IBase64Engine} from "./IBase64Engine";

const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

interface ITextCodec {
    encode: (str: string) => Uint8Array;
    decode: (str: Uint8Array) => string;
}

export class Base64 implements IBase64Engine {
    public static engine: IBase64Engine = new Base64();

    protected textCodec: ITextCodec;

    constructor(encoder?: ITextCodec) {
        this.textCodec = encoder || {
            encode: Unicode.stringToBytes,
            decode: Unicode.bytesToString,
        };
    }

    public static encode(str: string) {
        return this.engine.encode(str);
    }

    public static decode(str: string) {
        return this.engine.decode(str);
    }

    public static decodeToBytes(str: string) {
        return this.engine.decodeToBytes(str);
    }

    public static encodeBytes(bytes: Uint8Array) {
        return this.engine.encodeBytes(bytes);
    }

    public static test(str: string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
    }

    public encode(str: string) {
        const bytes = this.textCodec.encode(str);
        return this.encodeBytes(bytes);
    }

    public decode(str: string) {
        const bytes = this.decodeToBytes(str);

        return this.textCodec.decode(bytes);
    }

    public decodeToBytes(b64: string) {
        const length = b64.length;
        const placeHolders = this.placeHoldersCount(b64);

        const byteLength = (length * 3 / 4) - placeHolders;
        const bytes = new Uint8Array(byteLength);

        // if there are placeholders, only get up to the last complete 4 chars
        const l = placeHolders > 0 ? length - 4 : length;

        let L = 0;

        const rev = (index: number) => this.rev(b64[index]);

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

    public encodeBytes(uint8: Uint8Array) {
        const length = uint8.length;
        const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
        const parts = [];
        const maxChunkLength = 16383; // must be multiple of 3

        const length3 = length - extraBytes;

        // go through the array every three bytes, we'll deal with trailing stuff later
        for (let start = 0; start < length3; start += maxChunkLength) {
            const chunkEnd = start + maxChunkLength;

            const end = chunkEnd > length3 ? length3 : chunkEnd;

            const part = this.encodeChunk(uint8, start, end);

            parts.push(part);
        }

        // pad the end with zeros, but make sure to not forget the extra bytes
        switch (extraBytes) {
            case 1: {
                const tmp = uint8[length - 1];
                parts.push(
                    chars[(tmp >> 2)],
                    chars[0x3F & (tmp << 4)],
                    "==",
                );
                break;
            }
            case 2: {
                const tmp = (uint8[length - 2] << 8) + (uint8[length - 1]);
                parts.push(
                    chars[(tmp >> 10)],
                    chars[0x3F & (tmp >> 4)],
                    chars[0x3F & (tmp << 2)],
                    "=",
                );
                break;
            }
        }

        return parts.join("");
    }

    protected rev(char: string) {
        if (char === "-") {
            return 62;
        }
        if (char === "_") {
            return 63;
        }
        return chars.indexOf(char);
    }

    protected placeHoldersCount(b64: string) {
        const len = b64.length;

        if (len % 4 > 0) {
            throw new Error("Invalid string. Length must be a multiple of 4");
        }

        // the number of equal signs (place holders)
        // if there are two placeholders, than the two characters before it
        // represent one byte
        // if there is only one, then the three characters before it represent 2 bytes
        // this is just a cheap hack to not do indexOf twice
        if ("=" === b64[len - 2]) {
            return 2;
        }

        return "=" === b64[len - 1] ? 1 : 0;
    }

    protected tripletToBase64(num: number) {
        return "".concat(
            chars[0x3F & (num >> 18)],
            chars[0x3F & (num >> 12)],
            chars[0x3F & (num >> 6)],
            chars[0x3F & (num)],
        );
    }

    protected encodeChunk(uint8: Uint8Array, start: number, end: number) {
        const output = [];

        for (let i = start; i < end; i += 3) {
            const tmp =
                +(uint8[i] << 16)
                + (uint8[i + 1] << 8)
                + (uint8[i + 2]);

            output.push(this.tripletToBase64(tmp));
        }
        return output.join("");
    }
}
