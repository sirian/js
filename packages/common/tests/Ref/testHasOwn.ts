import {Ref} from "../../src";

describe("", () => {
    const data: Array<[any, any, boolean]> = [
        [{}, "x", false],
        [{x: 1}, "x", true],
        [{}, "hasOwnProperty", false],
        [Object.prototype, "hasOwnProperty", true],
        [new Array(2), 1, false],
        [[1, 1, 1], 1, true],
        [[1, 1, 1], 4, false],
        [[1, 1, 1], "length", true],
        ["foo", 1, true],
        ["foo", "length", true],
        ["foo", "toString", false],
        [null, "toString", false],
    ];

    test.each(data)("Ref.hasOwn(%o, %o) === %o", (target, key, expected) => {
        expect(Ref.hasOwn(target, key)).toBe(expected);
    });
});
