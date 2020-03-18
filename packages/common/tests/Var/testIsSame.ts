import {isEqual} from "../../src";
import {TestUtil} from "../TestUtil";

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
        const x = TestUtil.eval(code1);
        for (const code2 of data) {
            const y = TestUtil.eval(code2);
            const expected = Object.is(x, y);
            test(`Var.isSame(${code1}, ${code2}) = ${expected}`, () => expect(isEqual(x, y)).toBe(expected));
        }
    }
});
