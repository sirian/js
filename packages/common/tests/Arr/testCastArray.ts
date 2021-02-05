import {castArray} from "../../src";

describe("", () => {
    const data = [1, "", "foo", true, false, NaN, {0: 1, length: 1}]
        .map((x) => [x, [x]]);

    test.each(data)("Arr.cast(%o) === %o", (value, expected) => {
        expect(castArray(value)).toEqual(expected);
        expect(castArray([value])).toEqual(expected);
    });

    test.each([null, undefined])("Arr.cast(%o) === []", (value) => {
        expect(castArray(value)).toStrictEqual([]);
    });

    test("Arr.cast preserve reference", () => {
        const a: any[] = [];
        expect(castArray(a)).toBe(a);
        expect(castArray(a)).toStrictEqual([]);

        const b = [a, 1];
        const bCasted = castArray(b);
        expect(bCasted).toBe(b);
        expect(bCasted).toStrictEqual([a, 1]);
    });
});
