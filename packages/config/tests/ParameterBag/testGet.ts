import {ParameterBag, ParameterNotFoundError} from "../../src";

describe("ParameterBag.get", () => {
    const o: any = {
        n: null,
        u: undefined,
        x: 1,
        y: "foo",
    };
    const p = new ParameterBag(o);

    test("ParameterBag.get parameter with value=null", () => {
        expect(p.get("n")).toBe(null);
        expect(p.get("n", null)).toBe(null);
        expect(p.get("n", undefined)).toBe(null);
        expect(p.get("n", 1)).toBe(null);
    });

    test("ParameterBag.get parameter with value=1", () => {
        expect(p.get("x")).toBe(1);
        expect(p.get("x", null)).toBe(1);
        expect(p.get("x", undefined)).toBe(1);
        expect(p.get("x", 2)).toBe(1);
    });

    test("ParameterBag.get parameter with value='foo'", () => {
        expect(p.get("y")).toBe("foo");
        expect(p.get("y", null)).toBe("foo");
        expect(p.get("y", undefined)).toBe("foo");
        expect(p.get("y", 3)).toBe("foo");
    });

    test("ParameterBag.get parameter with value=undefined", () => {
        expect(p.get("u")).toBe(undefined);
        expect(p.get("u", null)).toBe(null);
        expect(p.get("u", undefined)).toBe(undefined);
        expect(p.get("u", 3)).toBe(3);
    });

    test("ParameterBag.get non existent parameter", () => {
        expect(() => p.get("z")).toThrow(ParameterNotFoundError);
        expect(p.get("z", null)).toBe(null);
        expect(() => p.get("z", undefined)).toThrow(ParameterNotFoundError);
        expect(p.get("z", 3)).toBe(3);
    });
});
