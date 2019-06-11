import {Str} from "../../src";

describe("", () => {
    const N = undefined;

    const dot = /./;
    const data: Array<[string, string | RegExp, number | undefined, string[]]> = [
        ["", "", 0, []],
        ["", "", 1, [""]],
        ["", "", 2, ["", ""]],
        ["", "", N, ["", ""]],
        ["", dot, N, [""]],
        ["", dot, 2, [""]],
        ["abcde", "", N, ["", "a", "b", "c", "d", "e", ""]],
        ["foo", "", 2, ["", "foo"]],
        ["foo", "o", N, ["f", "", ""]],
        ["foo", "o", 1, ["foo"]],
        ["foo", "o", 5, ["f", "", ""]],
        ["foo", dot, N, ["", "", "", ""]],
        ["foo", dot, 2, ["", "oo"]],
        ["foo", dot, 1, ["foo"]],
        ["foo", dot, 0, []],
        ["foo:bar", ":", N, ["foo", "bar"]],
        ["foo:bar", ":", 1, ["foo:bar"]],
        ["foo:bar:baz:zoo", ":", 0, []],
        ["foo:bar:baz:zoo", ":", 1, ["foo:bar:baz:zoo"]],
        ["foo:bar:baz:zoo", ":", 2, ["foo", "bar:baz:zoo"]],
        ["foo:bar:baz:zoo", ":", 3, ["foo", "bar", "baz:zoo"]],
        ["foo:bar:baz:zoo", ":", 4, ["foo", "bar", "baz", "zoo"]],
        ["foo:bar:baz:zoo", ":", N, ["foo", "bar", "baz", "zoo"]],
    ];

    test.each(data)("Str.split(%p, %p, %p) === %p", (subject, pattern, limit, expected) => {
        expect(Str.split(subject, pattern, limit)).toStrictEqual(expected);
    });
});
