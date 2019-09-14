import {ParameterBag} from "../../src";

describe("ParameterBag.get", () => {
    test("ParameterBag.get", () => {
        const o: any = {
            u: undefined,
            x: 1,
            y: "",
        };
        const p = new ParameterBag(o);

        expect(p.get("x")).toBe(1);
        expect(p.get("x", 2)).toBe(1);

        expect(p.get("y")).toBe("");
        expect(p.get("y", "42")).toBe("");

        expect(p.get("u")).toBe(undefined);
        expect(p.get("u", 123)).toBe(123);

        expect(p.get("z")).toBe(undefined);
        expect(p.get("z", 456)).toBe(456);
    });
});
