import {XMap} from "../../src";

describe("XMap.deleteStrict", () => {
    test("XMap.deleteStrict", () => {
        const m = new XMap();
        m.set("x", 1);
        expect(m.deleteStrict("x", 2)).toBe(false);
        expect(m.has("x")).toBe(true);
        expect(m.get("x")).toBe(1);
        expect(m.deleteStrict("x", 1)).toBe(true);
        expect(m.has("x")).toBe(false);
        expect(m.get("x")).toBe(undefined);
    });
});
