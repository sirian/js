import {TextEncoder} from "util";
import {ByteArray} from "../../src";
import {TestUtil} from "../TestUtil";

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

    test.each(TestUtil.randStrings(20))("ByteArray.stringify(%o)", (s) => {
        const expected = new TextEncoder().encode(s);
        const bytes = ByteArray.from(s).to(Uint8Array);
        expect(bytes).toStrictEqual(Uint8Array.from(expected));
        expect(ByteArray.stringify(bytes)).toBe(s);
    });
});
