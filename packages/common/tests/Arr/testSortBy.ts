import {shuffle, sortBy} from "../../src";

describe("sortBy", () => {
    test("sortBy", () => {
        const array = [
            -Infinity, -1n, -1, 0n, 0, 1n, 1, +Infinity, NaN, null, "-10", "bar", "foo", "zoo", undefined,
        ];

        const copy = shuffle([...array]);

        const sorted = sortBy(copy, (v) => v);

        expect(sorted).toBe(copy);
        expect(sorted).toStrictEqual(array);
    });

    test("sortBy", () => {
        const array = [{x: 1}, {x: 3}, {x: 2}];
        expect(sortBy(array, (v) => v.x)).toStrictEqual([{x: 1}, {x: 2}, {x: 3}]);
    });

    test("sortBy reverse", () => {
        const array = [{x: 1}, {x: 3}, {x: 2}];
        expect(sortBy(array, (v) => -v.x)).toStrictEqual([{x: 3}, {x: 2}, {x: 1}]);
    });

    test("sortBy reverse", () => {
        const array = [2, 3, 1];
        expect(sortBy(array, (v) => v)).toStrictEqual([1, 2, 3]);
        expect(sortBy(array, (v) => -v)).toStrictEqual([3, 2, 1]);
    });
});
