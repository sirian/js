import {Arr} from "../../src";

describe("Arr.last", () => {
    const data: Array<[any, any[]]> = [
        [undefined, []],
        [1, [1]],
        [1, [2, 1]],
    ];

    test.each(data)("%o === Arr.last(%o)", (expected, arr) => {
        expect(Arr.last(arr)).toBe(expected);
    });
});
