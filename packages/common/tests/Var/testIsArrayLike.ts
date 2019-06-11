import {Var} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const data: Array<[string, boolean]> = [
        ["null", false],
        ["undefined", false],
        ["function(){}", false],
        ["{}", false],
        ["{length: -1}", false],
        ["{length: new Number()}", false],
        ["{length: \"\"}", false],
        ["{length: 1.5}", false],
        ["{length: -1}", false],
        ["{x: 1}", false],

        ["{length: 0}", true],
        ["[]", true],
        ["[,,]", true],
        ["new Array(3)", true],
        ["{0: 1, length: 10}", true],
    ];

    test.each(data)("Var.isArrayLike(%s) === %o", (code, expected) => {
        const value = Util.eval(code);
        expect(Var.isArrayLike(value)).toBe(expected);
    });
});
