import {assert} from "../../src";

describe("error() throws", () => {
    const falsy = [-0, 0, 0.0, 0n, "", NaN, false, null, undefined];
    const truthy = [
        1, -1, -Infinity, Infinity,
        [], [0], [""], [[]],
        {},
        ...falsy.map(Object),
    ];

    test.each(falsy)("error(%o) throws", (value) => {
        const msg = `Assert failed. Value "${value}" is falsy`;
        expect(() => assert(value, msg)).toThrow(msg);
    });

    test.each(truthy)("error(%o) throws", (value) => {
        expect(() => assert(value)).not.toThrow();
    });
});
