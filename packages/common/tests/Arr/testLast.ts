import {last} from "../../src";

describe("last", () => {
    const data: Array<[any, any[]]> = [
        [undefined, []],
        [1, [1]],
        [1, [2, 1]],
    ];

    test.each(data)("%o === last(%o)", (expected, arr) => {
        expect(last(arr)).toBe(expected);
    });
});
