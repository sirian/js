import {clone} from "../../src";
import {TestCloner} from "../TestCloner";

describe("", () => {
    const a = new Set([1, 2, 3]);
    const b = clone(a);

    TestCloner.multiTest(a);

    test("", () => {
        expect(a).toStrictEqual(new Set([1, 2, 3]));
        expect(b).toStrictEqual(new Set([1, 2, 3]));
    });

    test("", () => {
        a.delete(3);
        b.delete(1);

        expect(a).toStrictEqual(new Set([1, 2]));
        expect(b).toStrictEqual(new Set([2, 3]));
    });
});
