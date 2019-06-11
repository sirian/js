import {Str} from "../../src";

describe("", () => {
    const data = [
        [``, `"`, `""`],
        [`'`, `"`, `"'"`],
        [`"`, `"`, `"\\""`],
        [`"`, `'`, `'"'`],
        [`\\"`, `"`, `"\\\\\\""`],
        [`'`, `'`, `'\\''`],
        [`'\\`, `'`, `'\\'\\\\'`],
        [`hello "city"`, `"`, `"hello \\"city\\""`],
    ];

    test.each(data)("Str.wrap(%o, %o) == %o", (str, wrap, expected) => {
        expect(Str.wrap(str, wrap)).toBe(expected);
    });
});
