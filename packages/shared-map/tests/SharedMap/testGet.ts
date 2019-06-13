import {HybridMap} from "@sirian/common";
import {SharedMap} from "../../src";

describe("ShareStore.get", () => {
    test("ShareStore.get", () => {
        const foo1 = SharedMap.get("foo");
        const foo2 = SharedMap.get("foo");
        const bar = SharedMap.get("bar");

        expect(foo1).toBeInstanceOf(HybridMap);
        expect(foo2).toBeInstanceOf(HybridMap);
        expect(bar).toBeInstanceOf(HybridMap);
        expect(foo1).toBe(foo2);
        expect(foo1).not.toBe(bar);
    });
});
