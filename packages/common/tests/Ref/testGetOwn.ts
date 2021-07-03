import {getOwn} from "../../src";

describe("getOwn", () => {
    const data: Array<[any, any, any]> = [
        [{}, "x", undefined],
        [{x: 1}, "x", 1],
        [Object.create({x: 1}), "x", undefined],
        [{}, "hasOwnProperty", undefined],
        // eslint-disable-next-line @typescript-eslint/unbound-method
        [Object.prototype, "hasOwnProperty", Object.prototype.hasOwnProperty],
        [Array.from({length: 2}), 1, undefined],
        [[1, 2, 3], 1, 2],
        [[1, 2, 3], 4, undefined],
        [[1, 2, 3], "length", 3],
        [[1, 2, 3], "join", undefined],
        ["foo", 1, "o"],
        ["foo", "length", 3],
        ["foo", "toString", undefined],
        [null, "toString", undefined],
    ];

    test.each(data)("getOwn(%p, %o) === %p", (target, key, expected) => {
        expect(getOwn(target, key)).toBe(expected);
    });
});
