import {XProxy} from "../../src";

describe("XProxy", () => {
    test("Empty target and factory", () => {
        const proxy = XProxy.forObject<{ x: number }>();
        expect(() => proxy.x).toThrow("XProxy factory 'undefined' is not a function");
    });

    test("Empty target and invalid factory", () => {
        const proxy = XProxy.forObject<{ x: number }>(() => 1 as any);
        expect(() => proxy.x).toThrow("Invalid XProxy target '1'");
    });

    test("Empty target and valid factory", () => {
        const factory = jest.fn(() => ({x: 1, y: 2}));
        const proxy = XProxy.forObject({factory});
        expect(factory).toHaveBeenCalledTimes(0);
        expect(proxy.x).toBe(1);
        expect(factory).toHaveBeenCalledTimes(1);
        expect(proxy.y).toBe(2);
        expect(factory).toHaveBeenCalledTimes(1);
    });

    test("Has target and valid factory", () => {
        const factory = jest.fn(() => ({x: 2}));

        const proxy = XProxy.forObject({
            target: {x: 1},
            factory,
        });

        expect(proxy.x).toBe(1);
        expect(factory).toHaveBeenCalledTimes(0);
    });
});
