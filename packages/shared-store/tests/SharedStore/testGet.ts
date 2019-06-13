import {SharedStore} from "../../src";

describe("ShareStore.get", () => {
    test("ShareStore.get", () => {
        const foo1 = SharedStore.get("foo", () => ({x: 1}));
        const foo2 = SharedStore.get("foo", () => ({y: 1}));
        const bar = SharedStore.get("bar", () => ({z: 1}));

        expect(foo1).toStrictEqual({x: 1});
        expect(foo2).toStrictEqual({x: 1});
        expect(foo1).toBe(foo2);
        expect(foo1).not.toBe(bar);
        expect(bar).toStrictEqual({z: 1});
    });
});
