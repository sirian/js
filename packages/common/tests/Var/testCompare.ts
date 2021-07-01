import {compare} from "../../src";

describe("compare", () => {
    const data: Array<[any, any, -1 | 0 | 1]> = [
        [0, 0, 0],
        [1, 1, 0],
        [-1, -1, 0],
        [1, 2, -1],
        [2, 10, -1],
        [-1, -2, 1],
        [0, "0", -1],
        [-1, "-2", -1],
        [-2, "-1", -1],
        ["1", "10", -1],
        ["2", "10", 1],
        [NaN, NaN, 0],
        [null, null, 0],
        [undefined, undefined, 0],
        [null, undefined, -1],
    ];

    const array = [
        -Infinity, -2n, -2, -1n, -1, 0n, 0, 1n, 1, 2n, +Infinity, NaN, null, "-10", "1", "10", "2", "bar", "foo", "zoo", undefined,
    ];

    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            const y = array[j];
            const x = array[i];

            data.push([x, y, Object.is(x, y) ? 0 : -1]);
            data.push([y, x, Object.is(x, y) ? 0 : 1]);
        }
    }

    test.each(data)("compare(%o, %o) === %o", (x, y, expected) => {
        expect(compare(x, y)).toBe(expected);
    });
});
