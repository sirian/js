import {ByteArray, ByteArrayInput} from "@sirian/common";
import {base64Decode} from "./base64Decode";
import {base64Encode} from "./base64Encode";
import {base64Test} from "./const";

export const Base64 = {
    encode: (value: ByteArrayInput) => ByteArray.from(base64Encode(ByteArray.from(value))),
    decode: (value: ByteArrayInput) => ByteArray.from(base64Decode(ByteArray.stringify(value))),
    test: base64Test,
};
