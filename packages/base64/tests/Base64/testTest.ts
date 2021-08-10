import {base64Decode, base64Encode, base64MakeURISafe, base64Test} from "@sirian/base64";
import {makeArray} from "@sirian/common";

describe("", () => {
    test("", () => {
        const b64 = 'AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/w==';
        const dec = base64Decode(b64);
        const enc = base64Encode(dec);
        const encSafe = base64MakeURISafe(enc);

        expect(dec).toStrictEqual(new Uint8Array(makeArray(256, (k) => k)));
        expect(base64Test(b64)).toBe(true)
        expect(base64Test(enc)).toBe(true)
        expect(base64Test(encSafe)).toBe(true)
        expect(base64Decode(encSafe)).toStrictEqual(dec)
        expect(enc).toBe(b64)
    });
});
