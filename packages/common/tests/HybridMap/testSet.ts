import {HybridMap} from "../../src";

describe("set", () => {
    const data: any[] = [
        null,
        1,
        undefined,
        {},
    ];

    const map = new HybridMap();
    test.each(data)("set(%o) === %o", (key) => {
        const value = 123;
        expect(map.get(key)).toBe(undefined);
        expect(map.has(key)).toBe(false);

        map.set(key, value);
        expect(map.get(key)).toBe(value);
        expect(map.has(key)).toBe(true);

        map.delete(key);
        expect(map.get(key)).toBe(undefined);
        expect(map.has(key)).toBe(false);
    });
});
