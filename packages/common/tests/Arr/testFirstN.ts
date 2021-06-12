import {firstN} from "../../src";

describe("firstN", () => {
    const data: Array<[any, any, number]> = [
        [[], [], 1],
        [[], [1], 0],
        [[1], [1], 1],
        [[1], [1], 2],
        [[], [1, 2], 0],
        [[1], [1, 2], 1],
        [[1, 2], [1, 2], 2],
        [[1, 2], [1, 2], 3],
        [[], new Set([1, 2]), 0],
        [[1], new Set([1, 2]), 1],
        [[1, 2], new Set([1, 2]), 2],
        [[1, 2], new Set([1, 2]), 3],
    ];

    test.each(data)("%o === firstN(%o, n)", (expected, arr, n) => {
        expect(firstN(arr, n)).toStrictEqual(expected);
    });
});
