import {XMap} from "../../src";

describe("XMap.sort", () => {
    test("XMap.sort by value", () => {
        const map = new XMap([
            ["foo", 1],
            ["bar", -1],
            ["zoo", 0],
            ["baz", 3],
        ]);

        const res = map.sort((a, b) => a[1] < b[1] ? -1 : 1);

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

        const res = XMap.sort(map, (a, b) => a[0].localeCompare(b[0]));

        expect(res).toBe(map);

        expect([...res]).toStrictEqual([
            ["bar", -1],
            ["baz", 3],
            ["foo", 1],
            ["zoo", 0],
        ]);
    });
});
