/* eslint-disable unicorn/no-null */
import {makeArray, randomUint32} from "@sirian/common";
import {LZString} from "../../src";

describe("LZString", () => {
    const data: Array<[any, any]> = [
        [null, new Uint8Array()],
        ["", new Uint8Array([64])],
        ["Hello world!", new Uint8Array([4, 133, 48, 54, 96, 246, 0, 64, 238, 144, 39, 48, 4, 192, 132, 64])],
    ];

    test.each(data)("LZString.compress %o", (uncompressed, uint8Array) => {
        expect(LZString.compress(uncompressed)).toStrictEqual(uint8Array);
        expect(LZString.decompress(uint8Array)).toBe(uncompressed);
    });

    test("compresses and decompresses all printable UTF-16 characters", () => {
        let testString = "";
        let i;
        for (i = 32; i < 127; ++i) {
            testString += String.fromCharCode(i);
        }
        for (i = 128 + 32; i < 55_296; ++i) {
            testString += String.fromCharCode(i);
        }
        for (i = 63_744; i < 65_536; ++i) {
            testString += String.fromCharCode(i);
        }
        const compressed = LZString.compress(testString);
        expect(compressed).not.toBe(testString);
        const decompressed = LZString.decompress(compressed);
        expect(decompressed).toBe(testString);
    });

    test("compresses and decompresses a string that repeats", () => {
        const testString = "aaaaabaaaaacaaaaadaaaaaeaaaaa";
        const compressed = LZString.compress(testString);
        expect(compressed).not.toBe(testString);
        expect(compressed.length).toBeLessThan(testString.length);
        const decompressed = LZString.decompress(compressed);
        expect(decompressed).toBe(testString);
    });

    test("compresses and decompresses a long string", () => {
        const testString = makeArray(1000, () => randomUint32().toString(36)).join("");

        const compressed = LZString.compress(testString);
        expect(compressed).not.toBe(testString);
        expect(compressed.length).toBeLessThan(testString.length);
        const decompressed = LZString.decompress(compressed);
        expect(decompressed).toBe(testString);
    });
});
