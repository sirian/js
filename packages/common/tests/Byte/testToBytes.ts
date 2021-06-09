import {toBytes} from "../../src";

describe("toBytes", () => {
    const data: Array<[any, number[]]> = [
        ["", []],
        [null, []],
        [undefined, []],
        ["foo", [102, 111, 111]],
        ["💩", [240, 159, 146, 169]],
        [1, [49]],
        ["1", [49]],

        [[], []],
        [[1, 2, 3], [1, 2, 3]],
        [{...[1, 2, 3], length: 3}, [1, 2, 3]],

        [[1000], [232]],
        // [new Uint16Array([1000]), [232, 3]], // todo: jest bug with ArrayBuffer
        // [new Uint16Array([1000]).buffer, [232, 3]], // todo: jest bug with ArrayBuffer
    ];

    test.each(data)("toBytes(%o) is %p", (value, bytes) => {
        const expected = new Uint8Array(bytes);
        expect(toBytes(value)).toStrictEqual(expected);
    });
});
