import {KV} from "../../../src";

describe("", () => {
    const data: Array<[any, any[]]> = [
        [null, []],
        [undefined, []],
        [false, []],
        [0, []],
        ["", []],
        ["foo", [0, 1, 2]],
        [[], []],
        ["xy", [0, 1]],
        [["x", "y", 3], [0, 1, 2]],
        [{x: "1", y: 2}, ["x", "y"]],
        [{y: "bar", 1: "x", 2: "y", 0: "z", x: "foo"}, ["0", "1", "2", "y", "x"]],
        [[1, 2, 3], [0, 1, 2]],
        [[0, 1, 2], [0, 1, 2]],
        [{1: 1, 0: 0}, ["0", "1"]],
        [new Map([["foo", 1], ["bar", 2], [null, 3]]), ["foo", "bar", null]],
        [new Set([111, null, undefined]), [111, null, undefined]],
        [new WeakMap(), []],
        [new WeakSet(), []],
        [new Date(), []],
    ];

    test.each(data)("KV.keys(%j)", (object, expected) => {
        expect(KV.keys(object)).toStrictEqual(expected);
    });
});
