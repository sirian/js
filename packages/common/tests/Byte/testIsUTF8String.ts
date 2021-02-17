import {isUTF8String} from "../../src";

describe("Byte.isUTF8", () => {
    const data: Array<[string, boolean]> = [
        ["", true],
        ["\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69", true],
        ["\uD800", false],
        ["\uDFFF", false],
        ["\uDF06\uD834", false],
        ["\uDEAD", false],
        ["𝌆", true],
        ["💩", true],
        ["😹🐶😹🐶", true],
    ];

    const escaped = data.map(([v, e]) => [escape(v), e] as [string, boolean]);

    test.each(escaped)("Byte.isUTF(%p) === %p", (str, expected) => {
        expect(isUTF8String(unescape(str))).toBe(expected);
    });
});
