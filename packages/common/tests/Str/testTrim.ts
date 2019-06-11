import {Str} from "../../src";

type TrimFn = typeof Str.trim | typeof Str.trimLeft | typeof Str.trimRight;

describe("", () => {
    const data: Array<[TrimFn, [any, ...any[]], string]> = [
        [Str.trim, ["  \tfoo \n "], "foo"],
        [Str.trim, ["  \tfoo \n ", []], "  \tfoo \n "],
        [Str.trim, [" undefined", undefined], "undefined"],
        [Str.trim, [" undefined"], "undefined"],
        [Str.trim, ["  \tfoo \n ", ""], "  \tfoo \n "],
        [Str.trimLeft, ["  \tfoo \n "], "foo \n "],
        [Str.trimRight, ["  \tfoo \n "], "  \tfoo"],
        [Str.trimRight, ["/foo///", "/"], "/foo"],
        [Str.trimRight, ["/foo///", ["/"]], "/foo"],
        [Str.trimRight, ["/foo  ", "/"], "/foo  "],

        [Str.trimRight, ["fooabca", "abc"], "foo"],
        [Str.trimRight, ["fooabca", ["a", "b", "c"]], "foo"],
    ];

    test.each(data)("%p(%j) === %s", (fn, args, expected) => {
        const value = fn(...args);
        expect(value).toBe(expected);
    });

    test("", () => {
        const invalidTrim = "" as any;
        expect(Str.trim("/foo/", "/", invalidTrim)).toBe("/foo/");
    });
});
