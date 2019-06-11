import {HybridMap} from "../../src";

describe("HybridMap.getMapForKey", () => {
    const map = new HybridMap();
    const data: Array<[any, any]> = [
        [{}, map.weakMap],
        [Object(1), map.weakMap],
        [null, map.strongMap],
        [undefined, map.strongMap],
        [Symbol.iterator, map.strongMap],
        [1, map.strongMap],
    ];

    test.each(data)("HybridMap.getMapForKey(%o) === %o", (key, expected) => {
        expect(map.getMapForKey(key)).toBe(expected);
    });
});
