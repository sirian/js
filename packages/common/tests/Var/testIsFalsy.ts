import {Var} from "../../src";

describe("Var.isFalsy", () => {
    const falsy = [-0, 0, 0.0, 0n, "", NaN, false, null, undefined];
    const truthy = [
        1, -1, -Infinity, Infinity,
        [], [0], [""], [[]],
        {},
        ...falsy.map(Object),
    ];

    test.each(falsy)("Var.isFalsy(%o) === false", (value) => {
        expect(Var.isFalsy(value)).toBe(true);
        expect(Var.isTruthy(value)).toBe(false);
    });

    test.each(truthy)("Var.isFalsy(%o) === true", (value) => {
        expect(Var.isFalsy(value)).toBe(false);
        expect(Var.isTruthy(value)).toBe(true);
    });
});
