import {XSet} from "../../src";

describe("XSet.toArray", () => {
    const data = [
        [[], []],
        [[1, 2, 1], [1, 2]],
        [[1, 2, 3, 1, 1], [1, 2, 3]],
    ];

    test.each(data)("XSet(%p).toUnicode() === %p", (values, expected) => {
        expect(new XSet(values).toArray()).toStrictEqual(expected);
    });
});
