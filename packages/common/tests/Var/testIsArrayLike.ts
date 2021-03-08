import {isArrayLike} from "../../src";
import {TestUtil} from "../TestUtil";

describe("", () => {
    const data: Array<[string, boolean, boolean]> = [
        ["null", false, false],
        ["undefined", false, false],
        ["{}", false, false],
        ["{length: -1}", true, false],
        ["{length: 1.5}", true, false],
        ["{length: ''}", false, false],
        ["{length: '0'}", true, false],
        ["{x: 1}", false, false],
        ["function(){}", false, false],
        ["''", true, true],
        ["'foo'", true, true],
        ["{length: 0}", true, true],
        ["[]", true, true],
        ["[,,]", true, true],
        ["new Array(3)", true, true],
        ["{0: 1, length: 10}", true, true],
    ];

    test.each(data)("Var.isArrayLike(%s) === %o", (code, expected, expectedStrict) => {
        const value = TestUtil.eval(code);
        expect(isArrayLike(value)).toBe(expectedStrict);
    });
});
