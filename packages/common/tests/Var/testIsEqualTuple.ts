import {isEqualTuple} from "../../src";
import {TestUtil} from "../TestUtil";

describe("isEqualTuple", () => {
    const foo = {x: 1};
    const bar = foo;
    const trueData: Array<[any, any]> = [
        [[], []],
        [[1], [1]],
        [[3, foo, "bar"], [3, bar, "bar"]],
        [[undefined], Array(1)],
        [[-0], [+0]],
        [[NaN], [NaN]],
    ];

    const falseData: Array<[any, any]> = [
        [Array(3), [null, null, null]],
        [[{x: 1}], [{x: 1}]],
        [[null], []],
    ];

    test.each(TestUtil.mergeData(trueData, falseData))("isEqualTuple(%o, %o) === %o", (t1, t2, expected) => {
        expect(isEqualTuple(t1, t2)).toBe(expected);
    });
});
