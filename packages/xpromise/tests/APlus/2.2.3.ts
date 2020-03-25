import {specify, testRejected} from "./helper";

import {Adapter} from "./Adapter";


const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it
const sentinel = {sentinel: "sentinel"}; // a sentinel fulfillment value to test for with strict equality

describe("2.2.3: If `onRejected` is a function,", () => {
    describe("2.2.3.1: it must be called after `promise` is rejected, with `promise`’s rejection reason as its " +
        "first argument.", () => {
        testRejected(sentinel, (promise, done) => {
            promise.then(null, reason => {
                expect(reason).toBe(sentinel);
                done();
            });
        });
    });

    describe("2.2.3.2: it must not be called before `promise` is rejected", () => {
        specify("rejected after a delay", done => {
            const d = Adapter.deferred();
            let isRejected = false;

            d.promise.then(null, () => {
                expect(isRejected).toBe(true);
                done();
            });

            setTimeout(() => {
                d.reject(dummy);
                isRejected = true;
            }, 5);
        });

        specify("never rejected", done => {
            const d = Adapter.deferred();
            let onRejectedCalled = false;

            d.promise.then(null, () => {
                onRejectedCalled = true;
                done();
            });

            setTimeout(() => {
                expect(onRejectedCalled).toBe(false);
                done();
            }, 5);
        });
    });

    describe("2.2.3.3: it must not be called more than once.", () => {
        specify("already-rejected", done => {
            let timesCalled = 0;

            Adapter.rejected(dummy).then(null, () => {
                expect(++timesCalled).toBe(1);
                done();
            });
        });

        specify("trying to reject a pending promise more than once, immediately", done => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(null, () => {
                expect(++timesCalled).toBe(1);
                done();
            });

            d.reject(dummy);
            d.reject(dummy);
        });

        specify("trying to reject a pending promise more than once, delayed", done => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(null, () => {
                expect(++timesCalled).toBe(1);
                done();
            });

            setTimeout(() => {
                d.reject(dummy);
                d.reject(dummy);
            }, 5);
        });

        specify("trying to reject a pending promise more than once, immediately then delayed", done => {
            const d = Adapter.deferred();
            let timesCalled = 0;

            d.promise.then(null, () => {
                expect(++timesCalled).toBe(1);
                done();
            });

            d.reject(dummy);
            setTimeout(() => {
                d.reject(dummy);
            }, 5);
        });

        specify("when multiple `then` calls are made, spaced apart in time", done => {
            const d = Adapter.deferred();
            const timesCalled = [0, 0, 0];

            d.promise.then(null, () => {
                expect(++timesCalled[0]).toBe(1);
            });

            setTimeout(() => {
                d.promise.then(null, () => {
                    expect(++timesCalled[1]).toBe(1);
                });
            }, 1);

            setTimeout(() => {
                d.promise.then(null, () => {
                    expect(++timesCalled[2]).toBe(1);
                    done();
                });
            }, 2);

            setTimeout(() => {
                d.reject(dummy);
            }, 3);
        });

        specify("when `then` is interleaved with rejection", done => {
            const d = Adapter.deferred();
            const timesCalled = [0, 0];

            d.promise.then(null, () => {
                expect(++timesCalled[0]).toBe(1);
            });

            d.reject(dummy);

            d.promise.then(null, () => {
                expect(++timesCalled[1]).toBe(1);
                done();
            });
        });
    });
});
