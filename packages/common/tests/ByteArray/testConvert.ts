import {TextEncoder} from "util";
import {ByteArray} from "../../src";

describe("ByteArray.from && ByteArray.stringify", () => {
    const data = [
        new ByteArray([]),
        new ByteArray([0]),
        new ByteArray([0, 0]),
        new ByteArray([239, 191, 189]),
    ];

    test.each(data)("%p", (byteArray) => {
        const str = ByteArray.stringify(byteArray);
        const bts = ByteArray.from(str);

        expect(bts).toStrictEqual(byteArray);
        expect(ByteArray.stringify(bts)).toBe(str);
    });

    test("Random strings", () => {
        for (let i = 0; i < 10; i++) {
            const s = Array(15).map(() => String.fromCharCode(Math.floor(2 ** 16 * Math.random()))).join("");
            const bytes = ByteArray.from(s).to(Uint8Array);

            expect(bytes).toStrictEqual(new TextEncoder().encode(s));
            expect(ByteArray.stringify(bytes)).toBe(s);
        }
    });
});
