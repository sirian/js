import {Entries} from "../../src";

describe("Entries.from", () => {
    const data: Array<[any, any]> = [
        ["foo", [[0, "f"], [1, "o"], [2, "o"]]],
        [[], []],
        [{}, []],
        [[1], [[0, 1]]],
        [{0: 1}, [["0", 1]]],

        [[1, 2], [[0, 1], [1, 2]]],
        [{x: 1}, [["x", 1]]],
        [{x: undefined}, [["x", undefined]]],

        // eslint-disable-next-line no-sparse-arrays
        [[1, /*hole*/, 3], [[0, 1], [1, undefined], [2, 3]]],
    ];

    test.each(data)("Entries.from(%O) === %O", (value, expected) => {
        expect(Entries.from(value)).toStrictEqual(new Entries(expected));
    });
});
