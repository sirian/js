import {first} from "../../src";

describe("first", () => {
    const data: Array<[any, any]> = [
        [undefined, []],
        [1, [1]],
        [2, [2, 1]],
        [2, {0: 2}],
        [1, new Set([1, 2])],
    ];

    test.each(data)("%o === first(%o)", (expected, arr) => {
        expect(first(arr)).toBe(expected);
    });
});
