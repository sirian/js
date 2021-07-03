import {Predicate} from "@sirian/ts-extra-types";
import {isFalsy, isNullish, isNumber, isObject, isTruthy} from "../../src";

describe("not()", () => {
    const data: Array<[Predicate, any[]]> = [
        [isObject, [{x: 1}]],
        [isNumber, [1, 2]],
        [isTruthy, [1, 2, {x: 1}]],
        [isFalsy, [null, "", false]],
        [isNullish, [null]],
        [Boolean, [1, 2, {x: 1}]],
    ];

    const array = [null, 1, 2, "", false, {x: 1}];
    test.each(data)("not(%o)", (f, expected) => {
        // eslint-disable-next-line unicorn/no-array-callback-reference
        expect(array.filter(f)).toStrictEqual(expected);
    });
});
