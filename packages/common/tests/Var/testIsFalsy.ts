import {isFalsy, isTruthy, toObject} from "../../src";

describe("Var.isFalsy", () => {
    const falsy = [-0, 0, 0, 0n, "", NaN, false, null, undefined];
    const truthy = [
        1, -1, -Infinity, Infinity,
        [], [0], [""], [[]],
        {},
        ...falsy.map((element) => toObject(element)),
    ];

    test.each(falsy)("Var.isFalsy(%o) === false", (value) => {
        expect(isFalsy(value)).toBe(true);
        expect(isTruthy(value)).toBe(false);
    });

    test.each(truthy)("Var.isFalsy(%o) === true", (value) => {
        expect(isFalsy(value)).toBe(false);
        expect(isTruthy(value)).toBe(true);
    });
});
