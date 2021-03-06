import {range} from "../../src";

describe("Arr.range", () => {
    const data: Array<[number, number, number, number[]]> = [
        [0, 1, 1, [0, 1]],
        [0, 1, 0.5, [0, 0.5, 1]],
        [0, 1, 0.8, [0, 0.8]],
        [0, 1, -1, []],

        [1, 0, 1, []],
        [1, 0, -0.5, [1, 0.5, 0]],
        [1, 0, -1, [1, 0]],
    ];

    test.each(data)("Arr.range(%O, %O, %O) === %O", (from, to, step, expected) => {
        expect(range(from, to, step)).toStrictEqual(expected);
    });
});
