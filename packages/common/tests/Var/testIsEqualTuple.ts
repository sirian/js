import {isEqualTuple} from "../../src";

describe("isEqualTuple", () => {
    const foo = {x: 1};
    const bar = foo;

    const trueData = [
        [[], []],
        [[1], [1]],
        [[3, foo, "bar"], [3, bar, "bar"]],
        [[undefined], new Array(1)],
        [[-0], [+0]],
        [[NaN], [NaN]],
    ].map((v) => [...v, true] as [any, any, true]);

    const falseData = [
        [new Array(3), [null, null, null]],
        [[{x: 1}], [{x: 1}]],
        [[null], []],
    ].map((v) => [...v, false] as [any, any, false]);

    test.each([...trueData, ...falseData])("isEqualTuple(%o, %o) === %o", (t1, t2, expected) => {
        expect(isEqualTuple(t1, t2)).toBe(expected);
    });
});
