import {trim, trimLeft, trimRight} from "../../src";

type TrimFn = typeof trim | typeof trimLeft | typeof trimRight;

describe("", () => {
    const data: Array<[TrimFn, [any, ...any[]], string]> = [
        [trim, [""], ""],
        [trim, [" "], ""],
        [trim, ["  "], ""],
        [trim, [" foo"], "foo"],
        [trim, ["  foo"], "foo"],
        [trim, ["foo "], "foo"],
        [trim, ["foo  "], "foo"],
        [trim, [" foo "], "foo"],
        [trim, ["  foo "], "foo"],
        [trim, [" foo  "], "foo"],
        [trim, ["  foo  "], "foo"],
        [trim, ["  \tfoo \n "], "foo"],
        [trim, ["  \n "], ""],
        [trim, ["  \tfoo \n ", []], "  \tfoo \n "],
        [trim, [" undefined", undefined], "undefined"],
        [trim, [" undefined"], "undefined"],
        [trim, ["  \tfoo \n ", ""], "  \tfoo \n "],
        [trimLeft, ["  \tfoo \n "], "foo \n "],
        [trimRight, ["  \tfoo \n "], "  \tfoo"],
        [trimRight, ["/foo///", "/"], "/foo"],
        [trimRight, ["/foo///", ["/"]], "/foo"],
        [trimRight, ["/foo  ", "/"], "/foo  "],

        [trimRight, ["fooabca", "abc"], "foo"],
        [trimRight, ["fooabca", ["a", "b", "c"]], "foo"],
    ];

    test.each(data)("%p(%j) === %s", (fn, args, expected) => {
        const value = fn(...args);
        expect(value).toBe(expected);
    });

    test("", () => {
        const invalidTrim = "" as any;
        expect(trim("/foo/", "/", invalidTrim)).toBe("/foo/");
    });
});
