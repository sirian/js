import {pad} from "../../src";

describe("", () => {
    const data: Array<[any, string]> = [
        [["1", 8], "       1"],
        [[1, 8], "       1"],
        [["1", 8, "0"], "00000001"],
        [["1", 8, "0", "left"], "00000001"],
        [["1", 8, "0", "right"], "10000000"],
        [["1", 8, "0", "both"], "00001000"],
        [["foo", 8, "0", "both"], "000foo00"],
        [["foo", 7, "0", "both"], "00foo00"],
        [["foo", 7, "01", "both"], "01foo01"],
        [["foo", 8, "01", "both"], "010foo01"],
        [["foo", 7, "!@$%dofjrofj", "both"], "!@foo!@"],
        [["", 2], "  "],
        [[null, 2], "  "],
        [[undefined, 2], "  "],
    ];

    test.each(data)("Str.pad(...%j) === %o", (args: [string, number, ...any[]], expected) => {
        expect(pad(...args)).toBe(expected);
    });
});
