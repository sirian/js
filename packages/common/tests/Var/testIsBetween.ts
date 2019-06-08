import {Var} from "../../src";

describe("isBetween", () => {
    const e = 1e-10;
    const data: Array<[any, any, any, boolean]> = [
        [0, 0, 0, true],
        [0, -1, 1, true],
        [-1, -1, 1, true],
        [-1 + e, -1, 1, true],
        [1 - e, -1, 1, true],
        [1 + e, -1, 1, false],
        [-1 - e, -1, 1, false],

        [0, -Infinity, 1, true],
        [0, -1, Infinity, true],
        [0, -Infinity, Infinity, true],
        [-Infinity, -Infinity, Infinity, true],
        [+Infinity, -Infinity, Infinity, true],
        [NaN, -Infinity, +Infinity, false],
        [NaN, -1, 1, false],

        [false, 0, 1, false],
        [true, 0, 1, false],
        [false, false, true, true],
        [false, false, false, true],
        [true, false, true, true],
        [true, true, true, true],

        ["0", "0", "2", true],
        ["1", "0", "2", true],
        ["10", "0", "2", true],
        ["1A", "0", "2", true],

        ["a", "a", "b", true],
        ["aaa", "a", "b", true],
        ["ba", "a", "b", false],

        [new Date(100), new Date(200), new Date(300), false],
        [new Date(250), new Date(200), new Date(300), true],
    ];

    test.each(data)("Var.isBetween(%o) === %o", (x, min, max, expected) => {
        expect(Var.isBetween(x, min, max)).toBe(expected);
    });
});
