import {toUTF} from "../../src";

describe("toUTF", () => {
    const data: Array<[string, number[]]> = [
        ["", []],
        ["foo", [102, 111, 111]],
        ["💩", [240, 159, 146, 169]],
        ["1", [49]],
    ];

    test.each(data)("%p === toUTF(%o)", (expected, bytes) => {
        expect(toUTF(bytes)).toStrictEqual(expected);
    });
});
