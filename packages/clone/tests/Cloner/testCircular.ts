import {clone} from "../../src";
import {TestCloner} from "../TestCloner";

describe("Test circular", () => {

    const x: any = {
        foo: 1,
    };
    x.x = x;

    TestCloner.multiTest(x);

    test("maxDepth=0", () => {
        const copy = clone(x, {maxDepth: 0});
        expect(copy).toStrictEqual(x);
        expect(copy).not.toBe(x);
        expect(copy.x).toBe(x);
    });

    for (const maxDepth of [1, 2, 3]) {
        test(`maxDepth=${maxDepth}`, () => {
            const copy = clone(x, {maxDepth});
            expect(copy).toStrictEqual(x);
            expect(copy).not.toBe(x);
            expect(copy.x).not.toBe(x);
            expect(copy.x).toBe(copy);
        });
    }
});
