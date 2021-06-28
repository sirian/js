import {isBoolean, isEqualNaN, isNull, isNullish, isNumber, isString} from "@sirian/common";
import {ArgConstraint, ArgResolver} from "../../src";

describe("ArgResolver.test", () => {
    const data: Array<[any, ArgConstraint, boolean]> = [
        [3, isNumber, true],
        [3, isString, false],
        [3, 3, true],
        [3, null, false],
        [false, true, false],
        [false, false, true],
        [false, isBoolean, true],
        [null, isNull, true],
        [null, isNullish, true],
        [undefined, isNullish, true],
        [undefined, isNull, false],
        [NaN, isEqualNaN, true],
    ];

    test.each(data)("ArgResolver.test(%O, %O) === %O", (value, constraint, expected) => {
        expect(ArgResolver.test(value, constraint)).toBe(expected);
    });
});
