import {ByteArray, ByteArraySource, toUTF} from "@sirian/common";
import {base64Decode} from "./base64Decode";
import {base64Encode} from "./base64Encode";
import {base64Test} from "./const";

interface IBase64 {
    encode(value: ByteArraySource, asString: true): string;

    encode(value: ByteArraySource, asString?: false): ByteArray;

    decode(value: ByteArraySource, asString: true): string;

    decode(value: ByteArraySource, asString?: false): ByteArray;

    test(value: ByteArraySource): boolean;
}

export const Base64 = {
    encode(value: ByteArraySource, asString = false) {
        const b64 = base64Encode(ByteArray.from(value));
        return asString ? b64 : ByteArray.from(b64);
    },
    decode(value: ByteArraySource, asString = false) {
        const uint8 = base64Decode(toUTF(value));
        const bytes = new ByteArray(uint8);
        return asString ? "" + bytes : bytes;
    },
    test: base64Test,
} as IBase64;
