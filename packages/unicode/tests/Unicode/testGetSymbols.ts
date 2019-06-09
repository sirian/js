import {Unicode} from "../../src";

describe("Unicode.getSymbols", () => {
    const data: Array<[string, string[]]> = [
        ["", []],
        ["foo", ["f", "o", "o"]],
        ["𝌆", ["𝌆"]],
        ["💩", ["💩"]],
        ["😹🐶😹🐶", ["😹", "🐶", "😹", "🐶"]],
    ];

    test.each(data)("Unicode.getSymbols(%s) === %o", (str: string, expected: string[]) => {
        expect(Unicode.getSymbols(str)).toStrictEqual(expected);
    });
});
