import {Predicate} from "@sirian/ts-extra-types/build/cjs";
import {Fn, Var} from "../../src";

describe("Fn.inverse", () => {
    const data: Array<[Predicate, Predicate]> = [
        [Var.isObject, (x) => "object" !== typeof x],
        [Var.isNumber, (x) => "number" !== typeof x],
        [Var.isTruthy, (x) => !x],
    ];
    const array = [1, 2, "", false, {x: 1}];
    test.each(data)("Fn.inverse()", (x, y) => {
        const actual = array.filter(Fn.inverse(x));
        const expected = array.filter(y);
        expect(actual).toStrictEqual(expected);
    });
});
