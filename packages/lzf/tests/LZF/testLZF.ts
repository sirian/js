import {Unicode} from "@sirian/common";
import {LZF} from "../../src";

describe("LZF", () => {
    const data: Array<[string, Uint8Array]> = [
        ["", new Uint8Array([])],
        ["Hello world!", new Uint8Array([11, 72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])],
        ["123123123123", new Uint8Array([3, 49, 50, 51, 49, 128, 2, 1, 50, 51])],
        ["111111111111", new Uint8Array([1, 49, 49, 192, 0, 1, 49, 49])],

    ];

    const check = (str: string, compressed?: Uint8Array) => {
        const uncompressed = Unicode.stringToBytes(str);
        compressed = compressed || LZF.compress(uncompressed);
        expect(LZF.compress(uncompressed)).toStrictEqual(compressed);
        expect(LZF.decompress(compressed)).toStrictEqual(uncompressed);
    };

    test.each(data)("LZF.compress %o", (input, compressed) => {
        check(input, compressed);
    });

    test("compresses and decompresses all printable UTF-16 characters", () => {
        let str = "";
        let i;
        for (i = 32; i < 127; ++i) {
            str += String.fromCharCode(i);
        }
        for (i = 128 + 32; i < 55296; ++i) {
            str += String.fromCharCode(i);
        }
        for (i = 63744; i < 65536; ++i) {
            str += String.fromCharCode(i);
        }
        check(str);
    });

    test("compresses and decompresses a string that repeats", () => {
        for (let i = 1; i < 6; i++) {
            check("x".repeat(10 ** i));
        }
    });

    test("compresses and decompresses a long string", () => {
        const str = [...Array(1000)].map(Math.random).join("");
        check(str);
    });
});
