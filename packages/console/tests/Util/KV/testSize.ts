import {KV} from "../../../src";

describe("", () => {
    const data: Array<[any, number]> = [
        [null, 0],
        [undefined, 0],
        [false, 0],
        [0, 0],
        ["", 0],
        ["foo", 3],
        [[], 0],
        [[1, 2, 3], 3],
        [new Array(10), 10],

        [{}, 0],
        [{x: 1}, 1],
        [{x: 1, y: 1, z: 1}, 3],
        [{y: "bar", 1: "x", 2: "y", 0: "z", x: "foo"}, 5],

        [Object.create(null), 0],

        [new Set([1, 2, 3]), 3],
        [new Set([1, 1]), 1],
        [new Set(), 0],

        [new Map(), 0],
        [new Map([[1, 2], [3, 4]]), 2],
        [new Map([[1, 2], [1, 2]]), 1],

        [new WeakSet(), 0],
        [new WeakMap(), 0],

        [{size: () => 4}, 4],
        [{length: 4}, 4],
    ];

    test.each(data)("KV.size(%O) === %o", (value, expected) => {
        expect(KV.size(value)).toStrictEqual(expected);
    });
});
