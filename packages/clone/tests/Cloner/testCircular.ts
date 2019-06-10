import {Cloner} from "../../src";
import {TestCloner} from "../TestCloner";

describe("Test circular", () => {

    const x: any = {
        foo: 1,
    };
    x.x = x;

    TestCloner.multiTest(x);

    test("maxDepth=0", () => {
        const clone = Cloner.clone(x, {maxDepth: 0});
        expect(clone).toStrictEqual(x);
        expect(clone).not.toBe(x);
        expect(clone.x).toBe(x);
    });

    for (const maxDepth of [1, 2, 3]) {
        test(`maxDepth=${maxDepth}`, () => {
            const clone = Cloner.clone(x, {maxDepth});
            expect(clone).toStrictEqual(x);
            expect(clone).not.toBe(x);
            expect(clone.x).not.toBe(x);
            expect(clone.x).toBe(clone);
        });
    }
});
