import {isPropWritable} from "../../src";

describe("Ref.isWritable", () => {
    const data = [
        [null, "x", false],
        [undefined, "x", false],
        ["foo", "x", true],
        [globalThis, "undefined", false],
        [globalThis, "NaN", false],
        [globalThis, "Infinity", false],
        [globalThis, "false", true],
        [3, "x", true],
        [{}, "x", true],
        [() => 1, "x", true],
        [Object.create(null), "x", true],
        [Object.create(null, {x: {writable: false}}), "x", false],
        [Object.create(null, {x: {get: () => 1}}), "x", false],
        [Object.seal({}), "x", false],
        [Object.seal({x: 1}), "x", true],
        [Object.freeze({x: 1}), "x", false],
        [Object.freeze({}), "x", false],
        [Object.preventExtensions(new class {public x() {}}), "x", true],
        [Object.preventExtensions(new class {public y() {}}), "x", false],
    ];

    test.each(data)("Ref.isWritable(%p, %p) === %p", (value, key, expected) => {
        expect(isPropWritable(value, key)).toBe(expected);
    });
});
