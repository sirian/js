import {Rgx} from "../../src";

describe("", () => {
    const data: Array<[string, string]> = [
        ["abcdef 123 .", "abcdef 123 \\."],
        ["\\ ^ $ * + ? . ( ) | { } [ ]", "\\\\ \\^ \\$ \\* \\+ \\? \\. \\( \\) \\| \\{ \\} \\[ \\]"],
    ];

    test.each(data)("", (input, expected) => {
        expect(Rgx.escape(input)).toBe(expected);
    });
});
