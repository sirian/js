import {Adapter} from "./Adapter";
import {testFulfilled, testRejected} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.4: `onFulfilled` or `onRejected` must not be called until the execution context stack contains only platform code.", () => {
    describe("`then` returns before the promise becomes fulfilled or rejected", () => {
        testFulfilled(dummy, (promise, done) => {
            let thenHasReturned = false;

            promise.then(() => {
                expect(thenHasReturned).toBe(true);
                done();
            });

            thenHasReturned = true;
        });
        testRejected(dummy, (promise, done) => {
            let thenHasReturned = false;

            promise.then(null, () => {
                expect(thenHasReturned).toBe(true);
                done();
            });

            thenHasReturned = true;
        });
    });

    describe("Clean-stack execution ordering tests (fulfillment case)", () => {
        test("when `onFulfilled` is added immediately before the promise is fulfilled", () => {
            const d = Adapter.deferred();
            let onFulfilledCalled = false;

            d.promise.then(() => {
                onFulfilledCalled = true;
            });

            d.resolve(dummy);

            expect(onFulfilledCalled).toBe(false);
        });

        test("when `onFulfilled` is added immediately after the promise is fulfilled", () => {
            const d = Adapter.deferred();
            let onFulfilledCalled = false;

            d.resolve(dummy);

            d.promise.then(() => {
                onFulfilledCalled = true;
            });

            expect(onFulfilledCalled).toBe(false);
        });

        test("when one `onFulfilled` is added inside another `onFulfilled`", (done) => {
            const promise = Adapter.resolved();
            let firstOnFulfilledFinished = false;

            promise.then(() => {
                promise.then(() => {
                    expect(firstOnFulfilledFinished).toBe(true);
                    done();
                });
                firstOnFulfilledFinished = true;
            });
        });

        test("when `onFulfilled` is added inside an `onRejected`", (done) => {
            const promise = Adapter.rejected();
            const promise2 = Adapter.resolved();
            let firstOnRejectedFinished = false;

            promise.then(null, () => {
                promise2.then(() => {
                    expect(firstOnRejectedFinished).toBe(true);
                    done();
                });
                firstOnRejectedFinished = true;
            });
        });

        test("when the promise is fulfilled asynchronously", (done) => {
            const d = Adapter.deferred();
            let firstStackFinished = false;

            setTimeout(() => {
                d.resolve(dummy);
                firstStackFinished = true;
            }, 0);

            d.promise.then(() => {
                expect(firstStackFinished).toBe(true);
                done();
            });
        });
    });

    describe("Clean-stack execution ordering tests (rejection case)", () => {
        test("when `onRejected` is added immediately before the promise is rejected", () => {
            const d = Adapter.deferred();
            let onRejectedCalled = false;

            d.promise.then(null, () => {
                onRejectedCalled = true;
            });

            d.reject(dummy);

            expect(onRejectedCalled).toBe(false);
        });

        test("when `onRejected` is added immediately after the promise is rejected", () => {
            const d = Adapter.deferred();
            let onRejectedCalled = false;

            d.reject(dummy);

            d.promise.then(null, () => {
                onRejectedCalled = true;
            });

            expect(onRejectedCalled).toBe(false);
        });

        test("when `onRejected` is added inside an `onFulfilled`", (done) => {
            const promise = Adapter.resolved();
            const promise2 = Adapter.rejected();
            let firstOnFulfilledFinished = false;

            promise.then(() => {
                promise2.then(null, () => {
                    expect(firstOnFulfilledFinished).toBe(true);
                    done();
                });
                firstOnFulfilledFinished = true;
            });
        });

        test("when one `onRejected` is added inside another `onRejected`", (done) => {
            const promise = Adapter.rejected();
            let firstOnRejectedFinished = false;

            promise.then(null, () => {
                promise.then(null, () => {
                    expect(firstOnRejectedFinished).toBe(true);
                    done();
                });
                firstOnRejectedFinished = true;
            });
        });

        test("when the promise is rejected asynchronously", (done) => {
            const d = Adapter.deferred();
            let firstStackFinished = false;

            setTimeout(() => {
                d.reject(dummy);
                firstStackFinished = true;
            }, 0);

            d.promise.then(null, () => {
                expect(firstStackFinished).toBe(true);
                done();
            });
        });
    });
});
