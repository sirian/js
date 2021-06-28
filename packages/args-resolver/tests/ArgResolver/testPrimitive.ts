import {ArgConstraint, ArgResolver} from "../../src";

const data: Array<[ArgConstraint, any, boolean]> = [
    [undefined, 1, false],
    [null, 1, false],
    [1, 1, true],
    [1, 2, false],
    [0, -0, true],
    [-0, 0, true],
    [null, null, true],
    [null, undefined, false],
    [undefined, null, false],
    [undefined, undefined, true],
    [NaN, NaN, true],
];

test.each(data)("ArgResolver.test(%o, %o) === %o", (constraint, arg, expected) => {
    const result = ArgResolver.test(arg, constraint);
    expect(result).toBe(expected);
});
