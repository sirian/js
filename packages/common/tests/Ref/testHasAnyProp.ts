import {hasAnyProp} from "../../src";

describe("hasAnyProp", () => {
    const obj = {x: 1, y: 2};
    const data: Array<[any, PropertyKey[], boolean]> = [
        [null, [], false],
        [null, ["x"], false],
        [undefined, [], false],
        [undefined, ["x"], false],

        [obj, [], false],
        [obj, ["a"], false],
        [obj, ["x"], true],
        [obj, ["y"], true],
        [obj, ["x", "y"], true],
        [obj, ["a", "y"], true],
        [obj, ["a", "x"], true],
        [obj, ["a", "b"], false],

        ["foo", [0, 4], true],
        ["foo", [3, 4], false],
    ];
    test.each(data)("hasAnyProp(%o, %o, %o)", (target, keys, expected) => {
        expect(hasAnyProp(target, keys)).toBe(expected);
    });
});
