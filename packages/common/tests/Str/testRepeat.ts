import {Str} from "../../src";

describe("", () => {
    const data: Array<[string, number, string]> = [
        ["foo", 1, "f"],
        ["foo", 2, "fo"],
        ["foo", 3, "foo"],
        ["foo", 4, "foof"],
        ["foo", 5, "foofo"],
        ["foo", 6, "foofoo"],
        ["foo", 7, "foofoof"],
    ];

    test.each(data)("", (str, max, expected) => {
        expect(Str.repeat(str, max)).toBe(expected);
    });
});
