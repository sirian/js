import {clone} from "../../src";
import {TestCloner} from "../TestCloner";

describe("", () => {
    const d1 = new Date();
    const d2 = new Date();

    const foo = {
        d1,
        bar: {
            d2,
        },
    };

    TestCloner.multiTest(foo);

    test("maxDepth = 0", () => {
        const copy = clone(foo, {maxDepth: 0});
        expect(copy).not.toBe(foo);
        expect(copy).toStrictEqual(foo);
        expect(copy.d1).toBe(d1);
        expect(copy.bar).toBe(foo.bar);
    });

    test("maxDepth = 1", () => {
        const copy = clone(foo, {maxDepth: 1});
        expect(copy).not.toBe(foo);
        expect(copy).toStrictEqual(foo);
        expect(copy.d1).not.toBe(d1);
        expect(copy.d1).toStrictEqual(d1);
        expect(copy.bar).not.toBe(foo.bar);
        expect(copy.bar.d2).toBe(d2);
    });

    test("maxDepth = 2", () => {
        const copy = clone(foo, {maxDepth: 2});
        expect(copy).not.toBe(foo);
        expect(copy).toStrictEqual(foo);
        expect(copy.d1).not.toBe(d1);
        expect(copy.d1).toStrictEqual(d1);
        expect(copy.bar).not.toBe(foo.bar);
        expect(copy.bar.d2).not.toBe(d2);
        expect(copy.bar.d2).toStrictEqual(d2);
    });
});
