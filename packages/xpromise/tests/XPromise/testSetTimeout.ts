import {XPromise} from "../../src";

describe("XPromise.setTimeout", () => {
    jest.useFakeTimers();
    test("Resolves before timeout", () => {
        const promise = new XPromise();
        promise.setTimeout(2);
        setTimeout(() => promise.resolve(1), 1);
        jest.runAllTimers();
        expect(promise).resolves.toBe(1);
    });

    test("Resolves before timeout", () => {
        const promise = new XPromise();
        promise.setTimeout(1);
        setTimeout(() => promise.resolve(1), 2);
        jest.runAllTimers();
        expect(promise).rejects.toThrow(Error);
    });

    test("promise.setTimeout(0) should be rejected on next tick", async () => {
        const promise = new XPromise();
        promise.setTimeout(0);
        expect(promise.isPending()).toBe(true);
        jest.runAllTimers();
        await expect(promise).rejects.toThrow(new Error("Rejected by timeout (0ms)"));
    });

    test("empty callback", () => {
        const promise = new XPromise();
        promise.setTimeout(1);
        jest.runAllTimers();
        expect(promise).rejects.toThrow(new Error());
    });

    test("custom error callback", () => {
        const promise = new XPromise();
        promise.setTimeout(1, () => new Error("foo"));
        jest.runAllTimers();
        expect(promise).rejects.toThrow(new Error("foo"));
    });

    test("custom reject callback", () => {
        const promise = new XPromise();
        promise.setTimeout(1, (p) => p.reject(""));
        jest.runAllTimers();
        expect(promise).rejects.toThrow("");
    });

    test("custom resolve callback", async () => {
        const promise = new XPromise();
        promise.setTimeout(1, (p) => p.resolve(123));
        jest.runAllTimers();
        expect(await promise).toBe(123);
    });

    test("custom noop callback", async () => {
        const promise = new XPromise();
        promise.setTimeout(1, () => {});
        jest.runAllTimers();
        await expect(promise).rejects.toThrow(new Error("Rejected by timeout (1ms)"));
    });

    test("custom error callback throws", () => {
        const promise = new XPromise();
        promise.setTimeout(1, () => { throw new Error("foo"); });
        jest.runAllTimers();
        expect(promise).rejects.toThrow(new Error("foo"));
    });
});
