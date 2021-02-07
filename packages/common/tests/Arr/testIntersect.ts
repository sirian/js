import {intersect} from "../../src";

describe("intersect", () => {
    const data = [
        [[], [], []],
        [[], [1], []],
        [[1], [1], [1]],
        [[1, 1], [1, 1], [1]],
        [[1], [1, 2], [1]],
        [[1, 1], [1, 2, 1], [1]],
        [[1, 1], [1, 2, 1], [1]],
        [[1, 2, 1, 2], [1, 2, 1, 2, 3], [1, 2]],
        [[1, 2, 1, 2, NaN], [1, 2, 1, 2, 3, NaN], [2, NaN, 1]],
    ];

    test.each(data)("%O === intersect(%O, %O)", (expected, array, array2) => {
        expect(intersect(array, array2)).toStrictEqual(expected);
    });
});
