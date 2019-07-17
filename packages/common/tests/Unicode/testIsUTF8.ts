import {Unicode} from "../../src";

describe("Unicode.isUTF8", () => {
    const data: Array<[string, boolean]> = [
        ["", true],
        ["\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC69", true],
        ["\uD800", false],
        ["𝌆", true],
        ["💩", true],
        ["😹🐶😹🐶", true],
    ];

    test.each(data)("Unicode.isUTF(%p) === %p", (str, expected) => {
        expect(Unicode.isUTF8(str)).toBe(expected);
    });
});
