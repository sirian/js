import {base64Chars} from "./const";

export function base64Encode(uint8: Uint8Array): string {
    const length = uint8.length;
    const extraBytes = length % 3; // if we have 1 byte left, pad 2 bytes
    let result = "";
    const maxChunkLength = 16383; // must be multiple of 3
    const length3 = length - extraBytes;

    // go through the array every three bytes, we'll deal with trailing stuff later
    const mask = 0x3F;
    for (let start = 0; start < length3; start += maxChunkLength) {
        const chunkEnd = start + maxChunkLength;

        const end = chunkEnd > length3 ? length3 : chunkEnd;

        let chunk = "";
        for (let i = start; i < end; i += 3) {
            const tmp =
                (uint8[i] << 16)
                + (uint8[i + 1] << 8)
                + (uint8[i + 2]);

            chunk +=
                base64Chars[mask & (tmp >> 18)] +
                base64Chars[mask & (tmp >> 12)] +
                base64Chars[mask & (tmp >> 6)] +
                base64Chars[mask & (tmp)];

        }
        result += chunk;
    }

    // pad the end with zeros, but make sure to not forget the extra bytes
    if (extraBytes === 1) {
        const tmp = uint8[length - 1];
        result +=
            base64Chars[(tmp >> 2)] +
            base64Chars[mask & (tmp << 4)] +
            "==";
    }
    if (extraBytes === 2) {
        const tmp = (uint8[length - 2] << 8) + (uint8[length - 1]);
        result +=
            base64Chars[(tmp >> 10)] +
            base64Chars[mask & (tmp >> 4)] +
            base64Chars[mask & (tmp << 2)] +
            "=";
    }

    return result;
}
