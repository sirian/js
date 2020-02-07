import {hasProp} from "../../src";

describe("", () => {
    const data: Array<[any, any, boolean]> = [
        [{}, "x", false],
        [{x: 1}, "x", true],
        [{}, "hasOwnProperty", true],
        [Object.prototype, "hasOwnProperty", true],
        [new Array(2), 1, false],
        [1, "toFixed", true],
        ["foo", 1, true],
        ["foo", "length", true],
        ["foo", "toString", true],
        [null, "toString", false],
    ];

    test.each(data)("Ref.has(%o, %o) === %o", (target, key, expected) => {
        expect(hasProp(target, key)).toBe(expected);
    });
});
