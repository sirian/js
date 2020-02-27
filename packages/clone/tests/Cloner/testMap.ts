import {clone} from "../../src";
import {TestCloner} from "../TestCloner";

describe("", () => {
    const a = new Map([["foo", 1]]);
    TestCloner.multiTest(a);

    const b = clone(a);

    test("", () => {
        expect(a).toStrictEqual(new Map([["foo", 1]]));
        expect(b).toStrictEqual(new Map([["foo", 1]]));
    });

    test("", () => {
        a.delete("foo");
        a.set("bar", 1);
        b.set("bar", 2);

        expect(a).toStrictEqual(new Map([["bar", 1]]));
        expect(b).toStrictEqual(new Map([["foo", 1], ["bar", 2]]));
    });
});
