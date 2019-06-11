import {Rgx} from "../../src";

describe("", () => {
    const data: Array<[string, RegExp | string, string[]]> = [
        ["foo1bar2zoo3", /\d+/, ["1", "2", "3"]],
        ["foo1bar2zoo3", /\woo/, ["foo", "zoo"]],
        ["foo1bar2zoo3", /f/, ["f"]],
        ["foo1bar2zoo3", /Zoo/, []],
        ["foo1bar2zoo3", /Zoo/i, ["zoo"]],
        ["foo1bar2zoo3", "zo", ["zo"]],
        ["abcde", "", ["", "", "", "", "", ""]],
        ["abcde", /()/, ["", "", "", "", "", ""]],
        ["abcde", /(?:)/, ["", "", "", "", "", ""]],
        ["", "", [""]],
        ["", /()/, [""]],
        ["", /(?:)/, [""]],
    ];

    test.each(data)("Rgx.matchAll(%p, %p) === %p", (str, pattern, expected) => {
        const res = [];
        for (const match of Rgx.matchAll(str, pattern)) {
            res.push(match[0]);
        }
        expect(res).toStrictEqual(expected);
    });
});
