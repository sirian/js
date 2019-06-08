import {AggregateError} from "../../src";

describe("AggregateError[Symbol.iterator]()", () => {
    test("AggregateError[Symbol.iterator]()", () => {
        const e = new AggregateError([1, 2]);
        expect([...e]).toStrictEqual([1, 2]);
        expect(e.errors).toStrictEqual([1, 2]);
    });

    test("AggregateError[Symbol.iterator]()", () => {
        const e = new AggregateError([]);
        expect([...e]).toStrictEqual([]);
        expect(e.errors).toStrictEqual([]);
    });
});
