import {lowerFirst} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        ["Foo", "foo"],
        ["FOO", "fOO"],
        ["fOO", "fOO"],
        [" Foo", " Foo"],
        [123, "123"],
        ["", ""],
        [null, ""],
        [undefined, ""],
    ];

    test.each(data)("Str.lowerFirst(%p) === %p", (value, expected) => {
        expect(lowerFirst(value)).toBe(expected);
    });
});
