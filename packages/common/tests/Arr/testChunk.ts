import {arrChunk} from "../../src";

describe("", () => {
    const data: Array<[number, any[]]> = [
        [1, [["a"], ["b"], ["c"], ["d"], ["e"]]],
        [2, [["a", "b"], ["c", "d"], ["e"]]],
        [3, [["a", "b", "c"], ["d", "e"]]],
        [4, [["a", "b", "c", "d"], ["e"]]],
        [5, [["a", "b", "c", "d", "e"]]],
        [6, [["a", "b", "c", "d", "e"]]],
    ];

    test.each(data)("Arr.chunk([a,b,c,d,e], %o) === %j", (size, expected) => {
        expect(arrChunk(["a", "b", "c", "d", "e"], size)).toStrictEqual(expected);
    });
});
