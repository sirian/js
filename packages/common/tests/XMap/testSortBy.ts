import {compare, sortMap, XMap} from "../../src";

describe("XMap.sort", () => {
    test("XMap.sort by value", () => {
        const map = new XMap([
            ["foo", 1],
            ["bar", -1],
            ["zoo", 0],
            ["baz", 3],
        ]);

        const res = map.sortBy((k, v) => v);

        expect(res).toBe(map);

        expect([...res]).toStrictEqual([
            ["bar", -1],
            ["zoo", 0],
            ["foo", 1],
            ["baz", 3],
        ]);
    });

    test("XMap.sort by key", () => {
        const map = new XMap([
            ["foo", 1],
            ["bar", -1],
            ["zoo", 0],
            ["baz", 3],
        ]);

        const res = map.sortBy((k, v) => k);

        expect(res).toBe(map);

        expect([...res]).toStrictEqual([
            ["bar", -1],
            ["baz", 3],
            ["foo", 1],
            ["zoo", 0],
        ]);
    });
});
