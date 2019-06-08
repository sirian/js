import {Arr} from "../../src";

function tst<T>(expected: T[], array: T[], ...arrays: T[][]) {
    test(`Arr.intersect()`, () => {
        expect(Arr.intersect(array, ...arrays)).toStrictEqual(expected);
    });
}

tst([], []);
tst([], [1], []);
tst([1], [1], [1]);
tst([1], [1, 2], [1]);
tst([1, 1], [1, 2, 1], [1]);
tst([1, 1], [1, 2, 1], [1]);
tst([1, 2, 1, 2], [1, 2, 1, 2, 3], [1, 2]);
tst([1, 2, 1, 2, NaN], [1, 2, 1, 2, 3, NaN], [2, NaN, 1]);
