import {XProxy} from "../../src";

describe("XProxy.get", () => {
    test("XProxy.get", () => {
        expect(() => XProxy.get({})).toThrow(`XProxy not found`);
    });

    test("XProxy.get", () => {
        const proxy = XProxy.forObject();
        const xProxy = XProxy.get(proxy);
        expect(xProxy.proxy).toBe(proxy);
        expect(XProxy.get(proxy)).toBe(xProxy);
    });

    test("XProxy.get", () => {
        const foo = XProxy.forObject();
        const fooX = XProxy.get(foo);
        const bar = XProxy.forObject({target: fooX});
        const barX = XProxy.get(bar);

        expect(XProxy.get(foo)).toBe(fooX);
        expect(XProxy.get(bar)).toBe(barX);

        expect(() => XProxy.get(fooX)).toThrow(`XProxy not found`);
        expect(() => XProxy.get(barX)).toThrow(`XProxy not found`);
    });
});
