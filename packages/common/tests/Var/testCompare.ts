import {compare} from "../../src";

describe("compare", () => {
    const array = [
        1, -0, 0, -1, -Infinity, Infinity, null, undefined, NaN, "", "foo", "bar",
    ];
    array.sort();

    const tmp = [];

    for (let i = 0; i < array.length; i++) {
        for (let j = i; j < array.length; j++) {
            tmp.push([array[i], array[j]]);
        }
    }

    test.each(tmp)("compare(%o, %o)", (x, y) => {
        expect(compare(x, y)).toBeLessThanOrEqual(0);
    });
});
