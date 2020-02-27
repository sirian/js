import {ByteArray} from "../../src";

describe("ByteArray.from", () => {
    const data: Array<[any, number[]]> = [
        ["", []],
        ["foo", [102, 111, 111]],

        [[], []],
        [[1, 2, 3], [1, 2, 3]],
        [{...[1, 2, 3], length: 3}, [1, 2, 3]],

        [[1000], [232]],
        [new Uint16Array([1000]), [232, 3]],
        [new Uint16Array([1000]).buffer, [232, 3]],
    ];
    test.each(data)("ByteArray.from(%O) is %p", (value, bytes) => {
        expect(ByteArray.from(value)).toStrictEqual(new ByteArray(bytes));
    });
});
