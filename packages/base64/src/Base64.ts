import {ByteInput, toBytes, toUTF} from "@sirian/common";
import {base64Decode} from "./base64Decode";
import {base64Encode} from "./base64Encode";
import {base64Test} from "./const";

interface IBase64 {
    encode(value: ByteInput, asString: true): string;

    encode(value: ByteInput, asString?: false): Uint8Array;

    decode(value: ByteInput, asString: true): string;

    decode(value: ByteInput, asString?: false): Uint8Array;

    test(value: ByteInput): boolean;
}

export const Base64 = {
    encode(value: ByteInput, asString = false) {
        value ??= "";
        const b64 = "" === value ? "" : base64Encode(toBytes(value));
        return asString ? b64 : toBytes(b64);
    },
    decode(value: ByteInput, asString = false) {
        value ??= "";
        if ("" === value) {
            return asString ? "" : new Uint8Array();
        }
        const uint8 = base64Decode(toUTF(value));
        return asString ? toUTF(uint8) : uint8;
    },
    test: base64Test,
} as IBase64;
