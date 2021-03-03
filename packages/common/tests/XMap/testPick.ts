import {XMap} from "../../src";

describe("XMap.pick", () => {
    test("XMap.pick correctly returns value and delete key", () => {
        const m = new XMap();
        expect(m.has("foo")).toBe(false);
        m.set("foo", "bar");
        expect(m.has("foo")).toBe(true);
        expect(m.pick("foo")).toBe("bar");
        expect(m.has("foo")).toBe(false);
        expect(() => m.pick("foo", true)).toThrow();
    });

    test("XMap.pick doesn't call ensure", () => {
        let x = 0;
        const m = new XMap(() => ++x);
        expect(m.has("foo")).toBe(false);
        expect(m.pick("foo")).toBe(undefined);
        expect(m.has("foo")).toBe(false);
        expect(x).toBe(0);
    });
});
