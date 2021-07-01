/* eslint-disable @typescript-eslint/no-floating-promises */
import {Adapter} from "./Adapter";
import {specify, testFulfilled} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it
const sentinel = {sentinel: "sentinel"}; // a sentinel fulfillment value to test for with strict equality

describe("2.2.2: If `onFulfilled` is a function,", () => {
    describe("2.2.2.1: it must be called after `promise` is fulfilled, with `promise`’s fulfillment value as its " +
        "first argument.", () => {
        testFulfilled(sentinel, (promise, done) => {
            promise.then((value) => {
                expect(value).toBe(sentinel);
                done();
            });
        });
    });

    describe("2.2.2.2: it must not be called before `promise` is fulfilled", () => {
        specify("fulfilled after a delay", (done) => {
            const d = Adapter.deferred();
            let isFulfilled = false;

            d.promise.then(() => {
                expect(isFulfilled).toBe(true);
                done();
            });

            setTimeout(() => {
                d.resolve(dummy);
                isFulfilled = true;
            }, 1);
        }, 2);

        specify("never fulfilled", (done) => {
            const d = Adapter.deferred();
            let onFulfilledCalled = false;

            d.promise.then(() => {
                onFulfilledCalled = true;
                done();
            });

            setTimeout(() => {
                expect(onFulfilledCalled).toBe(false);
                done();
            }, 1);
        }, 2);
    });

    describe("2.2.2.3: it must not be called more than once.", () => {
        specify("already-fulfilled", (done) => {
            let timesCalled = 0;

            Adapter.resolved(dummy).then(() => {
                expect(++timesCalled).toBe(1);
                done();
            });
        }, 1);

        specify("trying to fulfill a pending promise more than once, immediately", (done) => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(() => {
                expect(++timesCalled).toBe(1);
                done();
            });

            d.resolve(dummy);
            d.resolve(dummy);
        });

        specify("trying to fulfill a pending promise more than once, delayed", (done) => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(() => {
                expect(++timesCalled).toBe(1);
                done();
            });

            setTimeout(() => {
                d.resolve(dummy);
                d.resolve(dummy);
            }, 1);
        }, 2);

        specify("trying to fulfill a pending promise more than once, immediately then delayed", (done) => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(() => {
                expect(++timesCalled).toBe(1);
                done();
            });

            d.resolve(dummy);
            setTimeout(() => {
                d.resolve(dummy);
            }, 1);
        }, 2);

        specify("when multiple `then` calls are made, spaced apart in time", (done) => {
            const d = Adapter.deferred();
            const timesCalled = [0, 0, 0];

            d.promise.then(() => {
                expect(++timesCalled[0]).toBe(1);
            });

            setTimeout(() => {
                d.promise.then(() => {
                    expect(++timesCalled[1]).toBe(1);
                });
            }, 2);

            setTimeout(() => {
                d.promise.then(() => {
                    expect(++timesCalled[2]).toBe(1);
                    done();
                });
            }, 4);

            setTimeout(() => {
                d.resolve(dummy);
            }, 6);
        }, 8);

        specify("when `then` is interleaved with fulfillment", (done) => {
            const d = Adapter.deferred();
            const timesCalled = [0, 0];

            d.promise.then(() => {
                expect(++timesCalled[0]).toBe(1);
            });

            d.resolve(dummy);

            d.promise.then(() => {
                expect(++timesCalled[1]).toBe(1);
                done();
            });
        }, 1);
    });
});
