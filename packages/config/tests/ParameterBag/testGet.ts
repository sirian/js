import {ParameterBag, ParameterNotFoundError} from "../../src";

describe("ParameterBag.get", () => {
    const o: Record<string, any> = {
        n: null,
        u: undefined,
        f: false,
        s: "",
        z: 0,
    };

    const defaultValue = {};

    const data: Array<[keyof typeof o, any, any, any, any]> = [
        ["n", null, null, null, null],
        ["u", undefined, null, undefined, defaultValue],
        ["f", false, false, false, false],
        ["s", "", "", "", ""],
        ["z", 0, 0, 0, 0],
    ];

    describe.each(data)("ParameterBag.get(%s)", (key, a, b, c, d) => {
        const p = new ParameterBag(o);

        test(`ParameterBag.get(${key}) = ${a}`, () => expect(p.get(key)).toBe(a));
        test(`ParameterBag.get(${key}, null) = ${b}`, () => expect(p.get(key, null)).toBe(b));
        test(`ParameterBag.get(${key}, undefined) = ${c}`, () => expect(p.get(key, undefined)).toBe(c));
        test(`ParameterBag.get(${key}, defaultValue) = ${d}`, () => expect(p.get(key, defaultValue)).toBe(d));
    });

    test("ParameterBag.get non existent parameter", () => {
        const p = new ParameterBag(o);
        expect(() => p.get("404")).toThrow(ParameterNotFoundError);
        expect(p.get("404", null)).toBe(null);
        expect(() => p.get("404", undefined)).toThrow(ParameterNotFoundError);
        expect(p.get("404", defaultValue)).toBe(defaultValue);
    });
});
