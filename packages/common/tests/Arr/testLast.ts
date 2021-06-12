import {last} from "../../src";

describe("last", () => {
    const data: Array<[any, any]> = [
        [undefined, {}],
        [1, [1]],
        [2, [1, 2]],
        [2, {...[1, 2], length: 2}],
        [2, new Set([1, 2])],
    ];

    test.each(data)("%o === last(%o)", (expected, arr) => {
        expect(last(arr)).toBe(expected);
    });
});
