import {XPromise} from "../../src";

describe("XPromise.setTimeout", () => {
    jest.useFakeTimers();
    test("Resolves before timeout", () => {
        const promise = new XPromise().setTimeout(2);

        setTimeout(() => promise.resolve(1), 1);
        jest.runAllTimers();
        expect(promise.isRejected()).toBe(false);
        expect(promise.isTimedOut()).toBe(false);
        return expect(promise).resolves.toBe(1);
    });

    test("Resolves after timeout", () => {
        const promise = new XPromise().setTimeout(1);

        setTimeout(() => promise.resolve(1), 2);
        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("XPromise timeout exceeded"));
    });

    test("promise.setTimeout(0) should be rejected on next tick", () => {
        const promise = new XPromise().setTimeout(0);

        expect(promise.isPending()).toBe(true);
        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("XPromise timeout exceeded"));
    });

    test("empty callback", () => {
        const promise = new XPromise().setTimeout(1);

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("XPromise timeout exceeded"));
    });

    test("custom error callback", () => {
        const promise = new XPromise().setTimeout(1, () => new Error("foo"));

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("foo"));
    });

    test.only("custom reject callback", () => {
        const promise = new XPromise().setTimeout(1, (p) => p.reject("foo"));

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        void expect(promise).rejects.toThrow("foo");
    });

    test("custom resolve callback", () => {
        const promise = new XPromise().promise.setTimeout(1, (p) => p.resolve(123));

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(false);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).resolves.toBe(123);
    });

    test("custom noop callback", () => {
        const promise = new XPromise().promise.setTimeout(1, () => {});

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("XPromise timeout exceeded"));
    });

    test("custom error callback throws", () => {
        const promise = new XPromise().setTimeout(1, () => { throw new Error("foo"); });

        jest.runAllTimers();
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);
        return expect(promise).rejects.toThrow(new Error("foo"));
    });

    test("setTimeout inside setTimeout", () => {
        const error = new Error("foo");
        const promise = new XPromise().setTimeout(1, (p) => p.setTimeout(1, () => {throw error; }));

        jest.advanceTimersByTime(1);
        expect(promise.isRejected()).toBe(false);
        expect(promise.isPending()).toBe(true);
        expect(promise.isTimedOut()).toBe(false);
        jest.advanceTimersByTime(1);
        expect(promise.isRejected()).toBe(true);
        expect(promise.isTimedOut()).toBe(true);

        void expect(promise).rejects.toThrow(error);
    });
});
