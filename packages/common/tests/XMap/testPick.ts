import {XMap} from "../../src";

describe("", () => {
    test("XMap.pick correctly returns value and delete key", () => {
        const m = new XMap();
        expect(m.has("foo")).toBe(false);
        m.set("foo", "bar");
        expect(m.has("foo")).toBe(true);
        const value = m.pick("foo");
        expect(value).toBe("bar");
        expect(m.has("foo")).toBe(false);
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