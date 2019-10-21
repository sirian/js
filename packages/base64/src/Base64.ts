import {ArrBufTarget, TypedArr, Unicode} from "@sirian/common";

const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

export class Base64 {
    public static encode(str: ArrBufTarget) {
        return new Base64().encode(str);
    }

    public static decode(str: string, asString?: true): string;
    public static decode(str: string, asString: boolean): Uint8Array;

    public static decode(str: string, asString: boolean = true) {
        return new Base64().decode(str, asString) as any;
    }

    public static test(str: string) {
        return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(str);
    }

    public encode(data: ArrBufTarget): string {
        const uint8 = TypedArr.create(Uint8Array, data);
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

    public decode(b64: string, asString?: true): string;
    public decode(b64: string, asString: boolean): Uint8Array;

    public decode(b64: string, asString = true) {
        const length = b64.length;

        if (length % 4 > 0) {
            throw new Error(`Invalid string "${asString}". Length must be a multiple of 4`);
        }

        const placeHolders = "=" === b64[length - 2] ? 2 : ("=" === b64[length - 1] ? 1 : 0);

        const byteLength = (length * 3 / 4) - placeHolders;
        const bytes = new Uint8Array(byteLength);

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

        return asString ? Unicode.bytesToString(bytes) : bytes;
    }

    protected encodeChunk(uint8: Uint8Array, start: number, end: number) {
        const output = [];

        for (let i = start; i < end; i += 3) {
            const num = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);

            const chunk = ""
                + chars[0x3F & (num >> 18)]
                + chars[0x3F & (num >> 12)]
                + chars[0x3F & (num >> 6)]
                + chars[0x3F & (num)];

            output.push(chunk);
        }

        return output.join("");
    }
}
