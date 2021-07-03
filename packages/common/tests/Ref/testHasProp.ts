import {hasProp} from "../../src";

describe("hasProp", () => {
    const data: Array<[any, any, boolean]> = [
        [{}, "x", false],
        [{x: 1}, "x", true],
        [{}, "hasOwnProperty", true],
        [Object.create({}), "x", false],
        [Object.create({}, {x: {enumerable: false}}), "x", true],
        [Object.create({}, {x: {enumerable: false}}), "y", false],
        [Object.prototype, "hasOwnProperty", true],
        [Array.from({length: 2}), 1, false],
        [0, "toFixed", true],
        [1, "toFixed", true],
        ["foo", 1, true],
        ["foo", "length", true],
        ["foo", "toString", true],
        [null, "toString", false],
        [undefined, "toString", false],
    ];

    test.each(data)("hasProp(%p, %p) === %o", (target, key, expected) => {
        expect(hasProp(target, key)).toBe(expected);
    });
});
