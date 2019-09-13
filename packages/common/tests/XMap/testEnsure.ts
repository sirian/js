import {XMap} from "../../src";

describe("XMap.ensure", () => {
    test("XMap.ensure", () => {
        let x = 0;
        const m = new XMap<string, any>((k) => [k, ++x]);

        const key = "foo";
        expect(m.get(key)).toBe(undefined);
        expect(m.ensure(key)).toEqual([key, 1]);
        expect(m.get(key)).toEqual([key, 1]);
        expect(m.ensure(key)).toEqual([key, 1]);

        m.delete(key);

        expect(m.ensure(key)).toEqual([key, 2]);
        expect(x).toEqual(2);
        m.delete(key);

        expect(m.get(key)).toBe(undefined);
        expect(m.ensure(key, () => "bar")).toEqual("bar");
        expect(m.get(key)).toEqual("bar");
        expect(m.ensure(key)).toEqual("bar");
        expect(m.ensure(key, () => "zoo")).toEqual("bar");
        expect(x).toEqual(2);
    });
});
