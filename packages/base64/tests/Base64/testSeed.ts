import {makeArray, randomInt, randomUint8} from "@sirian/common";
import {Base64, base64Encode} from "../../src";

describe("Random strings", () => {
    const data = makeArray(100, () => new Uint8Array(makeArray(randomInt(0, 1000), randomUint8)));

    test.each(data)("encode/decode %o", (uint8) => {
        const b64 = Buffer.from(uint8).toString("base64");
        expect(base64Encode(uint8)).toBe(b64);
        expect(Base64.decode(b64)).toStrictEqual(uint8);
    });
});
