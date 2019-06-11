import {Cloner} from "../../src";
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
        const cloned = Cloner.clone(foo, {maxDepth: 0});
        expect(cloned).not.toBe(foo);
        expect(cloned).toStrictEqual(foo);
        expect(cloned.d1).toBe(d1);
        expect(cloned.bar).toBe(foo.bar);
    });

    test("maxDepth = 1", () => {
        const cloned = Cloner.clone(foo, {maxDepth: 1});
        expect(cloned).not.toBe(foo);
        expect(cloned).toStrictEqual(foo);
        expect(cloned.d1).not.toBe(d1);
        expect(cloned.d1).toStrictEqual(d1);
        expect(cloned.bar).not.toBe(foo.bar);
        expect(cloned.bar.d2).toBe(d2);
    });

    test("maxDepth = 2", () => {
        const cloned = Cloner.clone(foo, {maxDepth: 2});
        expect(cloned).not.toBe(foo);
        expect(cloned).toStrictEqual(foo);
        expect(cloned.d1).not.toBe(d1);
        expect(cloned.d1).toStrictEqual(d1);
        expect(cloned.bar).not.toBe(foo.bar);
        expect(cloned.bar.d2).not.toBe(d2);
        expect(cloned.bar.d2).toStrictEqual(d2);
    });
});
