import {Str} from "../../src";

describe("", () => {
    const data: Array<[string, Record<string, any>, string]> = [
        ["foo", {o: "a"}, "faa"],
        ["foo", {o: "a", oo: "b"}, "fb"],
        ["foo", {oo: "b", o: "a"}, "fb"],
        ["foo", {o: "a", a: "b"}, "faa"],
        ["foo", {oo: "a", a: "b", fa: "zo"}, "fa"],
        ["foo", {a: "b", oo: "a"}, "fa"],
        ["Hi: %s", {"%s": "%d", "%d": 10}, "Hi: %d"],
        ["1234", [4, 3, 2, 1], "3214"],
        ["1234", {0: 4, 1: 3, 2: 2, 3: 1}, "3214"],
        ["foo", {fo: () => "boo", bo: () => "zo", oo: "A", o: "a"}, "booa"],
    ];

    test.each(data)("Str.replace(%s, %j) === %s", (value, pairs, expected) => {
        expect(Str.replace(value, pairs)).toBe(expected);
    });
});
