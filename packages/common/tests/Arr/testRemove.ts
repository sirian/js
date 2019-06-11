import {Arr} from "../../src";

describe("", () => {
    const removeGt1Data = [
        [[1, 2, 3], [1]],
        [[1, 2, 3, 0, 1, 2], [1, 0, 1]],
        [[2, 3], []],
        [[-1, -2, -3], [-1, -2, -3]],
        [[], []],
        [[1, 2, 3, 0, 1, 2], [1, 0, 1]],
        [[NaN, 1, 2], [NaN, 1]],
    ];

    test.each(removeGt1Data)("", (arr: number[], expected) => {
        const res = Arr.remove(arr, (x) => x > 1);
        expect(res).toBe(arr);
        expect(res).toStrictEqual(expected);
    });

    const removeWithLimitData: Array<[number, number[]]> = [
        [-1, [0, 1, 2, 1, 3, 4, 1, 5]],
        [0, [0, 1, 2, 1, 3, 4, 1, 5]],
        [1, [0, 2, 1, 3, 4, 1, 5]],
        [2, [0, 2, 3, 4, 1, 5]],
        [3, [0, 2, 3, 4, 5]],
        [100, [0, 2, 3, 4, 5]],
        [Infinity, [0, 2, 3, 4, 5]],
    ];

    test.each(removeWithLimitData)("Arr.remove([0, 1, 2, 1, 3, 4, 1, 5], 1, %d) === %j", (limit, expected) => {
        expect(Arr.removeItem([0, 1, 2, 1, 3, 4, 1, 5], 1, limit)).toEqual(expected);
    });
});
