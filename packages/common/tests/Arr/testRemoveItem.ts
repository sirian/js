import {arrRemoveItem} from "../../src";

describe("", () => {
    const o1 = new Date(0);
    const o2 = new Date(1);

    const data: Array<[any[], any, any[]]> = [
        [[1, 2, 3], 1, [2, 3]],
        [[1, 2, 3], 0, [1, 2, 3]],
        [[1, 2, 3, 0, 1, 2], 1, [2, 3, 0, 2]],
        [[o1, o1], o1, []],
        [[o1, o1], o2, [o1, o1]],
        [[o1, o2, 0, o1], o1, [o2, 0]],
        [[NaN], NaN, []],
        [[0, -0], 0, []],
    ];

    test.each(data)("", (arr, remove, expected) => {
        const res = arrRemoveItem(arr, remove);
        expect(res).toBe(arr);
        expect(res).toStrictEqual(expected);
    });
});
