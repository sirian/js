import {Ref} from "../../src";

describe("Ref.isWritable", () => {
    const data = [
        [null, false],
        [undefined, false],
        ["foo", false],
        [3, false],
        [{}, true],
        [() => 1, true],
        [Object.create(null), true],
        [Object.create(null, {x: {writable: false}}), false],
        [Object.create(null, {x: {get: () => 1}}), false],
        [Object.seal({}), false],
        [Object.seal({x: 1}), true],
        [Object.freeze({x: 1}), false],
        [Object.freeze({}), false],
    ];

    test.each(data)("Ref.isWritable(%p, 'x') === %p", (value, expected) => {
        expect(Ref.isWritable(value, "x")).toBe(expected);
    });

});
