import {HttpHeaderBag} from "../../src";

describe("toString", () => {
    const data: Array<[string, string]> = [
        ["", ""],
        ["fff", "Fff: \r\n"],
        ["x-foo: bar\r\nZOO: baz", "X-Foo: bar\r\nZoo: baz\r\n"],
    ];

    test.each(data)("HttpHeaderBag(%o).toString() === %o", (value, expected) => {
        const actual = HttpHeaderBag.fromString(value).toString();
        expect(actual).toBe(expected);
    });
});
