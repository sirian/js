import {sortBy} from "../../src";

describe("sortBy", () => {
    test("sortBy", () => {
        const array = [
            1, -0, 0, -1, -Infinity, Infinity, null, undefined, NaN, "", "foo", "bar",
        ];

        const copy = [...array];

        array.sort();
        const sorted = sortBy(copy, (v) => v);

        expect(sorted).toBe(copy);
        expect(sorted).toStrictEqual(array.sort());
    });
});
