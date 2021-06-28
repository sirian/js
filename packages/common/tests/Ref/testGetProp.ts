import {getProp} from "../../src";

describe("getProp", () => {
    const data: Array<[any, any, any]> = [
        [null, "x", undefined],
        [undefined, "x", undefined],
        [{}, "x", undefined],
        [{x: 1}, "x", 1],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [{}, "hasOwnProperty", Object.prototype.hasOwnProperty],
        [Object.create({}), "x", undefined],
        [Object.create({}, {x: {enumerable: false, value: 1}}), "x", 1],
        [Object.create({}, {x: {enumerable: false, value: 1}}), "y", undefined],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [Object.prototype, "hasOwnProperty", Object.prototype.hasOwnProperty],
        [new Array(2), 1, undefined],
        ["foo", 1, "o"],
        ["foo", "length", 3],
    ];

    test.each(data)("getProp(%p, %p) === %o", (target, key, expected) => {
        expect(getProp(target, key)).toBe(expected);
    });
});
