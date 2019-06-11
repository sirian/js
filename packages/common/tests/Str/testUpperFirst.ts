import {Str} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        ["Foo", "Foo"],
        ["FOO", "FOO"],
        ["fOO", "FOO"],
        [" Foo", " Foo"],
        [123, "123"],
        ["", ""],
        [null, ""],
        [undefined, ""],
    ];

    test.each(data)("Str.upperFirst(%p) === %p", (value, expected) => {
        expect(Str.upperFirst(value)).toBe(expected);
    });
});
