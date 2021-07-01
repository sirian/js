/* eslint-disable @typescript-eslint/no-misused-promises */
import {sleep} from "@sirian/common";
import {Adapter} from "./Adapter";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it
const sentinel = {sentinel: "sentinel"}; // a sentinel fulfillment value to test for with strict equality

function testPromiseResolution(xFactory: () => PromiseLike<unknown>, fn: (promise: PromiseLike<any>) => void) {
    test("via return from a fulfilled promise", () => {
        return fn(Adapter.resolved(dummy).then(xFactory));
    });

    test("via return from a rejected promise", () => {
        return fn(Adapter.rejected(dummy).then(null, xFactory));
    });
}

describe("2.3.2: If `x` is a promise, adopt its state", () => {
    describe("2.3.2.1: If `x` is pending, `promise` must remain pending until `x` is fulfilled or rejected.",
        () => {
            testPromiseResolution(() => Adapter.deferred().promise, async (promise) => {
                const wasFulfilled = jest.fn();
                const wasRejected = jest.fn();

                promise.then(wasFulfilled, wasRejected);

                await sleep(1);
                expect(wasFulfilled).not.toHaveBeenCalled();
                expect(wasRejected).not.toHaveBeenCalled();
            });
        });

    describe("2.3.2.2: If/when `x` is fulfilled, fulfill `promise` with the same value.", () => {
        describe("`x` is already-fulfilled", () => {
            testPromiseResolution(
                () => Adapter.resolved(sentinel),
                (promise) => promise.then((value) => expect(value).toBe(sentinel)),
            );
        });

        describe("`x` is eventually-fulfilled", () => {
            testPromiseResolution(() => {
                    const d = Adapter.deferred();
                    setTimeout(() => d.resolve(sentinel), 1);
                    return d.promise;
                },
                (promise) => promise.then((value) => expect(value).toBe(sentinel)));
        });
    });

    describe("2.3.2.3: If/when `x` is rejected, reject `promise` with the same reason.", () => {
        describe("`x` is already-rejected", () => {
            testPromiseResolution(
                () => Adapter.rejected(sentinel),
                (promise) => promise.then(null, (reason) => expect(reason).toBe(sentinel)));
        });

        describe("`x` is eventually-rejected", () => {
            testPromiseResolution(() => {
                    const d = Adapter.deferred();
                    setTimeout(() => d.reject(sentinel), 1);
                    return d.promise;
                },
                (promise) => promise.then(null, (reason) => expect(reason).toBe(sentinel)));
        });
    });
});
