import {isPlainObject} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const data: Array<[string, boolean]> = [
        ["{}", true],
        ["{x: 1}", true],
        ["Object.create(null)", true],
        ["new Date()", false],
        ["1", false],
        ["new Object()", true],
        ["Object", false],
        ["Object.create(null)", true],
        ["new function(){}", false],
        ["new Function()", false],
        ["(class {}).prototype", false],
    ];

    test.each(data)("Var.isPlainObject(%s) === %o", (code, expected) => {
        const value = Util.eval(code);

        expect(isPlainObject(value)).toBe(expected);
    });
});
