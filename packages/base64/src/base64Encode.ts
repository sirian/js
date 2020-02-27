import {base64Chars} from "./const";

export function base64Encode(uint8: Uint8Array): string {
    const encodeChunk = (b: Uint8Array, start: number, end: number) => {
        const output = [];

        for (let i = start; i < end; i += 3) {
            const num = (b[i] << 16) + (b[i + 1] << 8) + (b[i + 2]);

            const chunk = ""
                + base64Chars[0x3F & (num >> 18)]
                + base64Chars[0x3F & (num >> 12)]
                + base64Chars[0x3F & (num >> 6)]
                + base64Chars[0x3F & (num)];

            output.push(chunk);
        }

        return output.join("");
    };

    const length = uint8.length;
    const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
    const parts = [];
    const maxChunkLength = 16383; // must be multiple of 3

    const length3 = length - extraBytes;

    // go through the array every three bytes, we'll deal with trailing stuff later
    for (let start = 0; start < length3; start += maxChunkLength) {
        const chunkEnd = start + maxChunkLength;

        const end = chunkEnd > length3 ? length3 : chunkEnd;

        const part = encodeChunk(uint8, start, end);

        parts.push(part);
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    switch (extraBytes) {
        case 1: {
            const tmp = uint8[length - 1];
            parts.push(
                base64Chars[(tmp >> 2)],
                base64Chars[0x3F & (tmp << 4)],
                "==",
            );
            break;
        }
        case 2: {
            const tmp = (uint8[length - 2] << 8) + (uint8[length - 1]);
            parts.push(
                base64Chars[(tmp >> 10)],
                base64Chars[0x3F & (tmp >> 4)],
                base64Chars[0x3F & (tmp << 2)],
                "=",
            );
            break;
        }
    }

    return parts.join("");
}
