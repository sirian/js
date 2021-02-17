import {pad, StrSide} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        [["1", 8], "       1"],
        [[1, 8], "       1"],
        [["1", 8, "0"], "00000001"],
        [["1", 8, "0", StrSide.LEFT], "00000001"],
        [["1", 8, "0", StrSide.RIGHT], "10000000"],
        [["1", 8, "0", StrSide.BOTH], "00001000"],
        [["foo", 8, "0", StrSide.BOTH], "000foo00"],
        [["foo", 7, "0", StrSide.BOTH], "00foo00"],
        [["foo", 7, "01", StrSide.BOTH], "01foo01"],
        [["foo", 8, "01", StrSide.BOTH], "010foo01"],
        [["foo", 7, "!@$%dofjrofj", StrSide.BOTH], "!@foo!@"],
        [["", 2], "  "],
        [[null, 2], "  "],
        [[undefined, 2], "  "],
    ];

    test.each(data)("Str.pad(...%j) === %o", (args: [string, number, ...any[]], expected) => {
        expect(pad(...args)).toBe(expected);
    });
});
