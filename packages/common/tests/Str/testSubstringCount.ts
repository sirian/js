import {substrCount} from "../../src";

describe("", () => {
    const data: Array<[string, string, number]> = [
        ["", "", 0],
        ["", "zoo", 0],
        ["0112", "1", 2],
        ["foofoofaa", "o", 4],
        ["foofoofaa", "a", 2],
        ["foofoofaa", "fo", 2],
        ["foofoofaa", "fe", 0],
        ["foofoofaa", "", 0],
    ];

    test.each(data)("Str.substringCount(%o, %o) === %o", (x, y, expected) => {
        expect(substrCount(x, y)).toBe(expected);
    });
});
