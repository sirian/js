import {stringifyVar} from "../../src";
import {Util} from "../Util";

describe("", () => {
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

    test.each(data)("Var.stringify(%s) === %o", (code, expected) => {
        const value = Util.eval(code);
        expect(stringifyVar(value)).toBe(expected);
    });
});
