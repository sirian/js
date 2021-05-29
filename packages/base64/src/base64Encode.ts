import {ByteInput, toBytes} from "@sirian/common";
import {base64Chars} from "./const";

export const base64Encode = (input: ByteInput): string => {
    if (null == input || "" === input) {
        return "";
    }

    const uint8 = toBytes(input);

    const len = uint8.length;
    const rest = len % 3;

    let result: string = "";

    for (let i = 0; i < len; i) {
        const a = uint8[i++];
        const b = i < len ? uint8[i++] : 0;
        const c = i < len ? uint8[i++] : 0;

        const bitmap = (a << 16) | (b << 8) | c;
        result +=
            base64Chars[bitmap >> 18 & 63]
            + base64Chars[bitmap >> 12 & 63]
            + base64Chars[bitmap >> 6 & 63]
            + base64Chars[bitmap & 63];
    }

    return rest ? result.slice(0, rest - 3) + (1 === rest ? "==" : "=") : result;
};
