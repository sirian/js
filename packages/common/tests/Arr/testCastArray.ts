import {castArray} from "../../src";

describe("", () => {
    const data = [1, "", "foo", true, false, NaN, {0: 1, length: 1}, null, undefined]
        .map((x) => [x, [x]]);

    test.each(data)("Arr.cast(%o) === %o", (value, expected) => {
        expect(castArray(value)).toEqual(expected);
        expect(castArray([value])).toEqual(expected);
    });

    test("Arr.cast preserve reference", () => {
        expect(castArray([])).toStrictEqual([]);
        expect(castArray([[2, 3], 1])).toStrictEqual([[2, 3], 1]);
    });
});
