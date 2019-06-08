import {_Object, Var} from "../../src";
import {Util} from "../Util";

describe("", () => {
    const data = [
        "Infinity",
        "-Infinity",
        "-0",
        "1",
        "{}",
        "new String('foo')",
        "new String()",
        "NaN",
        "''",
        "'foo'",
        "'1'",
        "'0'",
        "null",
        "undefined",
        "true",
        "false",
        "new Number(NaN)",
    ];

    for (const code1 of data) {
        const x = Util.eval(code1);
        for (const code2 of data) {
            const y = Util.eval(code2);
            const expected = _Object.is(x, y);
            test(`Var.isSame(${code1}, ${code2}) = ${expected}`, () => expect(Var.isEqual(x, y)).toBe(expected));
        }
    }
});
