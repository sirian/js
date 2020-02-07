import {Predicate} from "@sirian/ts-extra-types";
import {isNumber, isObject, isTruthy, negate} from "../../src";

describe("Fn.negate", () => {
    const data: Array<[Predicate, Predicate]> = [
        [isObject, (x) => "object" !== typeof x],
        [isNumber, (x) => "number" !== typeof x],
        [isTruthy, (x) => !x],
    ];
    const array = [1, 2, "", false, {x: 1}];
    test.each(data)("Fn.negate()", (x, y) => {
        const actual = array.filter(negate(x));
        const expected = array.filter(y);
        expect(actual).toStrictEqual(expected);
    });
});
