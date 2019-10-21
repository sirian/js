import {assert} from "../../src";
import {AssertError} from "../../src/AssertError";

describe("assert() throws", () => {
    const falsy = [-0, 0, 0.0, 0n, "", NaN, false, null, undefined];
    const truthy = [
        1, -1, -Infinity, Infinity,
        [], [0], [""], [[]],
        {},
        ...falsy.map(Object),
    ];

    test.each(falsy)("assert(%o) throws", (value) => {
        const msg = `Assert failed. Value "${value}" is falsy`;
        expect(() => assert(value, msg, 1, 2, 3)).toThrow(new AssertError(value, msg, [1, 2, 3]));
    });

    test.each(truthy)("assert(%o) throws", (value) => {
        expect(() => assert(value)).not.toThrow();
    });

    test("assert callbacks", () => {
        const e = new Error("123");
        expect(() => assert(false, () => e)).toThrow(e);
    });
});
