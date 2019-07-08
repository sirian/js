import {KV} from "../../../src";

describe("", () => {
    const data: Array<[any, Array<[any, any]>]> = [
        [null, []],
        [undefined, []],
        [false, []],
        [0, []],
        ["", []],
        ["foo", [[0, "f"], [1, "o"], [2, "o"]]],
        [[], []],
        [[1, 2, 3], [[0, 1], [1, 2], [2, 3]]],
        [new Array(2), [[0, undefined], [1, undefined]]],

        [{}, []],
        [{x: 1}, [["x", 1]]],
        [{x: 1, y: 2, z: 3}, [["x", 1], ["y", 2], ["z", 3]]],
        [{
            y: "bar",
            1: "x",
            2: "y",
            0: "z",
            x: "foo",
        }, [["0", "z"], ["1", "x"], ["2", "y"], ["y", "bar"], ["x", "foo"]]],

        [Object.create(null), []],

        [new Set([1, 2, 3]), [[1, 1], [2, 2], [3, 3]]],
        [new Set([1, 1]), [[1, 1]]],
        [new Set(), []],

        [new Map(), []],
        [new Map([[1, 2], [3, 4]]), [[1, 2], [3, 4]]],
        [new Map([[1, 2], [1, 2]]), [[1, 2]]],

        [new WeakSet(), []],
        [new WeakMap(), []],
    ];

    test.each(data)("KV.entries(%O) === %o", (value, expected) => {
        expect(KV.entries(value)).toStrictEqual(expected);
    });
});
