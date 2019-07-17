import {Unicode} from "../../src";

describe("Unicode.bytesToString && Unicode.stringToBytes", () => {
    const bytes = [
        [],
        [0],
        [0, 0],
        [239, 191, 189],
    ];

    const data = bytes.map((b) => new Uint8Array(b));

    test.each(data)("%p", (uint8Array) => {
        const str = Unicode.bytesToString(uint8Array);
        const bts = Unicode.stringToBytes(str);

        expect(bts).toStrictEqual(uint8Array);
        expect(Unicode.bytesToString(bts)).toBe(str);
    });
});
