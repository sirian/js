import {XProxy} from "../../src/XProxy";

describe("XProxy", () => {
    test("Empty target and factory", () => {
        const proxy = XProxy.forObject().proxy;
        expect(() => proxy.x).toThrow("Proxy targetFactory is not a function");
    });

    test("Empty target and invalid factory", () => {
        const proxy = XProxy.forObject().setTargetFactory(() => 1).proxy;
        expect(() => proxy.x).toThrow("Invalid proxy target");
    });

    test("Empty target and valid factory", () => {
        const factory = jest.fn(() => ({x: 1, y: 2}));
        const proxy = XProxy.forObject().setTargetFactory(factory).proxy;
        expect(factory).toHaveBeenCalledTimes(0);
        expect(proxy.x).toBe(1);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(proxy.y).toBe(2);
        expect(factory).toHaveBeenCalledTimes(1);
    });

    test("Has target and valid factory", () => {
        const factory = jest.fn(() => ({x: 2}));

        const proxy = XProxy.forObject()
            .setTarget({x: 1})
            .setTargetFactory(factory)
            .proxy;

        expect(proxy.x).toBe(1);
        expect(factory).toHaveBeenCalledTimes(0);
    });
});
