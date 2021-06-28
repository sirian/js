import {compare} from "../../src";

describe("compare", () => {
    const array = [
        -Infinity, -1n, -1, 0n, 0, 1n, 1, +Infinity, NaN, null, "-10", "bar", "foo", "zoo", undefined,
    ];

    const tmp = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            tmp.push([array[i], array[j]]);
        }
    }

    test.each(tmp)("compare(%o, %o)", (x, y) => {
        expect(compare(x, y)).toBeLessThanOrEqual(0);
    });

    test("compare(-1, -2)", () => {
        expect(compare(-1, -2)).toBe(1);
    });

    test("compare(-2, -1)", () => {
        expect(compare(-2, -1)).toBe(-1);
    });
});
