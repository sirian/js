import {XProxy} from "../../src";

describe("XProxy.find", () => {
    test("XProxy.find", () => {
        expect(XProxy.find({})).toBe(undefined);
    });

    test("XProxy.find", () => {
        const proxy = XProxy.forObject();
        const xProxy = XProxy.find(proxy)!;
        expect(xProxy.proxy).toBe(proxy);
        expect(XProxy.find(proxy)).toBe(xProxy);
    });

    test("XProxy.find", () => {
        const foo = XProxy.forObject();
        const fooX = XProxy.find(foo);
        const bar = XProxy.forObject({target: fooX});
        const barX = XProxy.find(bar);

        expect(XProxy.find(foo)).toBe(fooX);
        expect(XProxy.find(bar)).toBe(barX);

        expect(XProxy.find(fooX)).toBe(undefined);
        expect(XProxy.find(barX)).toBe(undefined);
    });
});
