import {ByteInput, toBytes} from "@sirian/common";
import {base64Chars, base64MakeURISafe} from "./const";

export const base64Encode = (input: ByteInput, uriSafe: boolean = false): string => {
    if (null == input || "" === input) {
        return "";
    }

    const uint8 = toBytes(input);
    const len = uint8.length;

    let result: string = "";

    for (let i = 0; i < len;) {
        const a = uint8[i++];
        const b = uint8[i++] ?? 0;
        const c = uint8[i++] ?? 0;

        const bitmap = (a << 16) | (b << 8) | c;
        result +=
            base64Chars[bitmap >> 18 & 63]
            + base64Chars[bitmap >> 12 & 63]
            + base64Chars[bitmap >> 6 & 63]
            + base64Chars[bitmap & 63];
    }

    const rest = len % 3;
    if (rest) {
        result = result.slice(0, rest - 3) + (1 === rest ? "==" : "=");
    }
    return uriSafe ? base64MakeURISafe(result) : result;
};
