import {XPromise} from "../../src";
import {XPromiseTimeoutError} from "../../src/XPromiseTimeoutError";

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
        expect(promise).rejects.toThrow(XPromiseTimeoutError);
    });

    test("promise.setTimeout(0) should be rejected on next tick", () => {
        const promise = new XPromise();
        promise.setTimeout(0);
        promise.resolve(1);
        jest.runAllTimers();
        expect(promise).resolves.toBe(1);
    });

    test("custom error callback", () => {
        const promise = new XPromise();
        promise.setTimeout(1, () => new Error("foo"));
        jest.runAllTimers();
        expect(promise).rejects.toThrow(new Error("foo"));
    });

    test("custom error callback throws", () => {
        const promise = new XPromise();
        promise.setTimeout(1, () => { throw new Error("foo"); });
        jest.runAllTimers();
        expect(promise).rejects.toThrow(new Error("foo"));
    });
});
