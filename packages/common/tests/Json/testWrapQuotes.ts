import {quoteBacktick, quoteDouble, quoteSingle} from "@sirian/common";

describe("", () => {
    const single = `'`;
    const double = `"`;
    const tag = "`";

    const str = "Hello " + single + double + tag;

    test("", () => {
        expect(quoteDouble(str)).toBe(`"Hello '\\"\`"`);
        expect(quoteSingle(str)).toBe(`'Hello \\'"\`'`);
        expect(quoteBacktick(str)).toBe("`Hello '\"\\``");

        expect(Function("return " + quoteSingle(str) + ";")()).toBe(str);
        expect(Function("return " + quoteDouble(str) + ";")()).toBe(str);
        expect(Function("return " + quoteBacktick(str) + ";")()).toBe(str);
    });
});
