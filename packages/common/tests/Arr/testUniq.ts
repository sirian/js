import {uniq} from "../../src";

describe("", () => {
    const data: Array<[any[], any[]]> = [
        [[1, 2, 3], [1, 2, 3]],
        [[1, 1, 2, 3, 0, 1, 2], [1, 2, 3, 0]],
        [[2, 3], [2, 3]],
        [[NaN, NaN], [NaN]],
        [[undefined, null, "", false, 0], [undefined, null, "", false, 0]],
    ];

    test.each(data)("", (arr: number[], expected) => {
        const res = uniq(arr);
        expect(res).toStrictEqual(expected);
    });
});
