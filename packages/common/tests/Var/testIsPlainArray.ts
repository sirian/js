import {Var} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const data: Array<[string, boolean]> = [
        ["[]", true],
        ["[1]", true],
        ["[,,]", true],
        ["new Array()", true],
        ["new Uint8Array()", false],
        ["new Object()", false],
    ];

    test.each(data)("Var.isPlainArray(%s) === %o", (code, expected) => {
        const value = Util.eval(code);

        expect(Var.isPlainArray(value)).toBe(expected);
    });
});
