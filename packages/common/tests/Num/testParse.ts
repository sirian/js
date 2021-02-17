import {parseNumber} from "../../src";

describe("", () => {
    const data: Array<[any, any]> = [
        ["", 0],
        ["0", 0],
        ["1.2", 1.2],
        [1.2, 1.2],
        ["1e3", 1000],
        [NaN, NaN],
        ["0b0", 0],
        ["0b1", 1],
        ["0b2", NaN],
        ["0x12", 18],
        ["0.1e100", 1e+99],
        [false, 0],
        [true, 1],
        [null, 0],
        [undefined, 0],
        [Infinity, Infinity],
        [-Infinity, -Infinity],
    ];

    const invalidData: any[] = [
        "[]", "0b2", NaN, Symbol.iterator, [], {}, new Date(), /./,
    ];

    test.each(data)("Num.parse(%p) === %p", (value, expected) => {
        const res = parseNumber(value, NaN);
        expect(res).toBe(expected);
    });

    test.each(invalidData)("Num.parse(%p, 1234) returns 1234", (value) => {
        expect(parseNumber(value, 1234)).toBe(1234);
        expect(parseNumber(value)).toBe(NaN);
    });
});
