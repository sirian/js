import {assert, toObject} from "../../src";

describe("error() throws", () => {
    const falsy = [-0, 0, 0, 0n, "", NaN, false, null, undefined] as const;

    const truthy = [
        1, -1, -Infinity, Infinity,
        [], [0], [""], [[]],
        {},
        ...falsy.map((element) => toObject(element)),
    ] as const;

    test.each(falsy)("error(%o) throws", (value) => {
        const msg = `Assert failed. Value is falsy`;
        expect(() => assert(value, msg)).toThrow(msg);
    });

    test.each(truthy)("error(%o) throws", (value) => {
        expect(() => assert(value)).not.toThrow();
    });
});
