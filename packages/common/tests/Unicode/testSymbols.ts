import {Unicode} from "../../src";

describe("", () => {
    const data: Array<[string, string[]]> = [
        ["", []],
        ["foo", ["f", "o", "o"]],
        ["𝌆", ["𝌆"]],
        ["💩", ["💩"]],
        ["😹🐶😹🐶", ["😹", "🐶", "😹", "🐶"]],
    ];

    test.each(data)("Unicode.from(%o).symbols === %o", (str: string, expected: string[]) => {
        expect(Unicode.from(str).symbols).toStrictEqual(expected);
    });
});
