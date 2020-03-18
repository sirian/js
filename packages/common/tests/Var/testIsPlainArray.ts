import {isPlainArray} from "../../src";
import {TestUtil} from "../TestUtil";

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
        const value = TestUtil.eval(code);

        expect(isPlainArray(value)).toBe(expected);
    });
});
