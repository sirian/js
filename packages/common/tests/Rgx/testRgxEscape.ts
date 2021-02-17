import {rgxEscape} from "../../src";

describe("", () => {
    const data: Array<[string, string]> = [
        ["foo.bar", "foo\\.bar"],
        ["([])", "\\(\\[\\]\\)"],
        ["abcdef 123 .", "abcdef 123 \\."],
        ["\\ ^ $ * + ? . ( ) | { } [ ]", "\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]"],
    ];

    test.each(data)("", (input, expected) => {
        expect(rgxEscape(input)).toBe(expected);
    });
});
