import {stringifyVar} from "../../src";
import {TestUtil} from "../TestUtil";

describe("stringifyVar", () => {
    const data = [
        [`Object("foo")`, "foo"],
        [`""`, ""],
        ["1", "1"],
        ["Object(3)", "3"],
        ["null", ""],
        ["0", "0"],
        ["false", "false"],
        ["undefined", ""],
    ];

    test.each(data)("stringifyVar(%s) === %o", (code, expected) => {
        const value = TestUtil.eval(code);
        expect(stringifyVar(value)).toBe(expected);
    });
});
