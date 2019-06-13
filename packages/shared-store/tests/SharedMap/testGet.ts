import {HybridMap} from "@sirian/common";
import {SharedStore} from "../../src";

describe("ShareStore.get", () => {
    test("ShareStore.get", () => {
        const foo1 = SharedStore.get("foo");
        const foo2 = SharedStore.get("foo");
        const bar = SharedStore.get("bar");

        expect(foo1).toBeInstanceOf(HybridMap);
        expect(foo2).toBeInstanceOf(HybridMap);
        expect(bar).toBeInstanceOf(HybridMap);
        expect(foo1).toBe(foo2);
        expect(foo1).not.toBe(bar);
    });
});
