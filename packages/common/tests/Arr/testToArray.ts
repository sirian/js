import {toArray} from "../../src";

describe("toArray", () => {
    const data: Array<[any, any[]]> = [
        [null, []],
        [undefined, []],
        ["", []],
        [1, []],
        [NaN, []],
        [false, []],
        [true, []],
        ["foo", ["f", "o", "o"]],
        [{}, []],
        [{length: 3}, [undefined, undefined, undefined]],
        [{1: 2, length: 3}, [undefined, 2, undefined]],
        [[1, 2, 3][Symbol.iterator](), [1, 2, 3]],
        [new Uint8Array([1, 2, 3]), [1, 2, 3]],

    ];
    test.each(data)("toArray(%o) === %o", (input, expected) => {
        expect(toArray(input)).toStrictEqual(expected);

    });
});
