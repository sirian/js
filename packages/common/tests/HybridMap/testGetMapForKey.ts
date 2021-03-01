import {HybridMap} from "../../src";

describe("HybridMap.getMap", () => {
    const map = new HybridMap();
    const data: Array<[any, any]> = [
        [{}, WeakMap],
        [Object(1), WeakMap],
        [null, Map],
        [undefined, Map],
        [Symbol.iterator, Map],
        [1, Map],
    ];

    test.each(data)("HybridMap.getMap(%o) === %o", (key, expected) => {
        expect(map.getMap(key)).toBeInstanceOf(expected);
    });
});
