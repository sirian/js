import {XSet} from "../../src";

describe("XSet.pick", () => {
    test("XSet.pick correctly returns value and delete key", () => {
        const m = new XSet();
        expect(m.pick("foo")).toBe(undefined);
        expect(m.has("foo")).toBe(false);

        m.add("foo");
        expect(m.has("foo")).toBe(true);
        expect(m.pick("foo")).toBe("foo");
        expect(m.has("foo")).toBe(false);
        expect(m.pick("foo")).toBe(undefined);

        expect(() => m.pick("foo", true)).toThrow();
    });
});
