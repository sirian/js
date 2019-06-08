import {Var} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const data: Array<[string, boolean]> = [
        ["{}", true],
        ["{x: 1}", true],
        ["Object.create(null)", true],
        ["new Date()", true],
        ["Date", false],
        ["1", false],
        ["new Object()", true],
        ["Object", false],
        ["new function(){}", true],
        ["new Function()", false],
    ];

    test.each(data)("Var.isObject(%s) === %o", (code, expected) => {
        const value = Util.eval(code);

        expect(Var.isObject(value)).toBe(expected);
    });
});
