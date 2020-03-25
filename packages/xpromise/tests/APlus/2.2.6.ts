import {testFulfilled, testRejected} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it
const other = {other: "other"}; // a value we don't want to be strict equal to
const sentinel = {sentinel: "sentinel"}; // a sentinel fulfillment value to test for with strict equality
const sentinel2 = {sentinel2: "sentinel2"};
const sentinel3 = {sentinel3: "sentinel3"};

function callbackAggregator(times, ultimateCallback) {
    let soFar = 0;
    return () => {
        if (++soFar === times) {
            ultimateCallback();
        }
    };
}

describe("2.2.6: `then` may be called multiple times on the same promise.", () => {
    describe("2.2.6.1: If/when `promise` is fulfilled, all respective `onFulfilled` callbacks must execute in the " +
        "order of their originating calls to `then`.", () => {
        describe("multiple boring fulfillment handlers", () => {
            testFulfilled(sentinel, (promise, done) => {
                const handler1 = jest.fn(() => other);
                const handler2 = jest.fn(() => other);
                const handler3 = jest.fn(() => other);

                const spy = jest.fn();

                promise.then(handler1, spy);
                promise.then(handler2, spy);
                promise.then(handler3, spy);

                promise.then(value => {
                    expect(value).toBe(sentinel);
                    expect(handler1).toHaveBeenCalledWith(sentinel);
                    expect(handler2).toHaveBeenCalledWith(sentinel);
                    expect(handler3).toHaveBeenCalledWith(sentinel);
                    expect(spy).not.toHaveBeenCalled();

                    done();
                });
            });
        });

        describe("multiple fulfillment handlers, one of which throws", () => {
            testFulfilled(sentinel, (promise) => {
                const handler1 = jest.fn(() => other);
                const handler2 = jest.fn(() => other);
                const handler3 = jest.fn(() => other);

                const spy = jest.fn();
                promise.then(handler1, spy);
                promise.then(handler2, spy);
                promise.then(handler3, spy);

                return promise.then(value => {
                    expect(value).toBe(sentinel);
                    expect(handler1).toHaveBeenCalledWith(sentinel);
                    expect(handler2).toHaveBeenCalledWith(sentinel);
                    expect(handler3).toHaveBeenCalledWith(sentinel);
                    expect(spy).not.toHaveBeenCalled();
                });
            });
        });

        describe("results in multiple branching chains with their own fulfillment values", () => {
            testFulfilled(dummy, (promise, done) => {
                const semiDone = callbackAggregator(3, done);

                promise.then(() => sentinel).then(value => {
                    expect(value).toBe(sentinel);
                    semiDone();
                });

                promise.then(() => {
                    throw sentinel2;
                }).then(null, reason => {
                    expect(reason).toBe(sentinel2);
                    semiDone();
                });

                promise.then(() => sentinel3).then(value => {
                    expect(value).toBe(sentinel3);
                    semiDone();
                });
            });
        });

        describe("`onFulfilled` handlers are called in the original order", () => {
            testFulfilled(dummy, (promise) => {
                const calls = [];
                const handler1 = jest.fn(() => {
                    calls.push(handler1);
                });
                const handler2 = jest.fn(() => {
                    calls.push(handler2);
                });
                const handler3 = jest.fn(() => {
                    calls.push(handler3);
                });

                promise.then(handler1);
                promise.then(handler2);
                promise.then(handler3);

                return promise.then(() => {
                    expect(calls).toStrictEqual([handler1, handler2, handler3]);
                });
            });

            describe("even when one handler is added inside another handler", () => {
                testFulfilled(dummy, (promise, done) => {
                    const calls = [];
                    const handler1 = jest.fn(() => {
                        calls.push(handler1);
                    });
                    const handler2 = jest.fn(() => {
                        calls.push(handler2);
                    });
                    const handler3 = jest.fn(() => {
                        calls.push(handler3);
                    });

                    promise.then(() => {
                        handler1();
                        promise.then(handler3);
                    });
                    promise.then(handler2);

                    promise.then(() => {
                        // Give implementations a bit of extra time to flush their internal queue, if necessary.
                        setTimeout(() => {
                            expect(calls).toStrictEqual([handler1, handler2, handler3]);
                            done();
                        }, 5);
                    });
                });
            });
        });
    });

    describe("2.2.6.2: If/when `promise` is rejected, all respective `onRejected` callbacks must execute in the " +
        "order of their originating calls to `then`.", () => {
        describe("multiple boring rejection handlers", () => {
            testRejected(sentinel, (promise, done) => {
                const handler1 = jest.fn(() => other);
                const handler2 = jest.fn(() => other);
                const handler3 = jest.fn(() => other);

                const spy = jest.fn();
                promise.then(spy, handler1);
                promise.then(spy, handler2);
                promise.then(spy, handler3);

                promise.then(null, reason => {
                    expect(reason).toBe(sentinel);
                    expect(handler1).toHaveBeenCalledWith(sentinel);
                    expect(handler2).toHaveBeenCalledWith(sentinel);
                    expect(handler3).toHaveBeenCalledWith(sentinel);
                    expect(spy).not.toHaveBeenCalled();

                    done();
                });
            });
        });

        describe("multiple rejection handlers, one of which throws", () => {
            testRejected(sentinel, async (promise) => {
                const handler1 = jest.fn(() => 1);
                const handler2 = jest.fn(() => {throw 2;});
                const handler3 = jest.fn(() => 3);

                const spy = jest.fn();

                await Promise.all([
                    expect(promise.then(spy, handler1)).resolves.toBe(1),
                    expect(promise.then(spy, handler2)).rejects.toBe(2),
                    expect(promise.then(spy, handler3)).resolves.toBe(3),

                    promise.then(null, reason => {
                        expect(reason).toBe(sentinel);
                        expect(handler1).toHaveBeenCalledWith(sentinel);
                        expect(handler2).toHaveBeenCalledWith(sentinel);
                        expect(handler3).toHaveBeenCalledWith(sentinel);
                        expect(spy).not.toHaveBeenCalled();
                    }),
                ]);
            });
        });

        describe("results in multiple branching chains with their own fulfillment values", () => {
            testRejected(sentinel, (promise, done) => {
                const semiDone = callbackAggregator(3, done);

                promise.then(null, () => sentinel).then(value => {
                    expect(value).toBe(sentinel);
                    semiDone();
                });

                promise.then(null, () => {
                    throw sentinel2;
                }).then(null, reason => {
                    expect(reason).toBe(sentinel2);
                    semiDone();
                });

                promise.then(null, () => sentinel3).then(value => {
                    expect(value).toBe(sentinel3);
                    semiDone();
                });
            });
        });

        describe("`onRejected` handlers are called in the original order", () => {
            testRejected(dummy, (promise, done) => {
                const calls = [];
                const handler1 = jest.fn(() => {
                    calls.push(handler1);
                });
                const handler2 = jest.fn(() => {
                    calls.push(handler2);
                });
                const handler3 = jest.fn(() => {
                    calls.push(handler3);
                });

                promise.then(null, handler1);
                promise.then(null, handler2);
                promise.then(null, handler3);

                promise.then(null, () => {
                    expect(calls).toStrictEqual([handler1, handler2, handler3]);
                    done();
                });
            });

            describe("even when one handler is added inside another handler", () => {
                testRejected(dummy, (promise, done) => {
                    const calls = [];
                    const handler1 = jest.fn(() => {
                        calls.push(handler1);
                    });
                    const handler2 = jest.fn(() => {
                        calls.push(handler2);
                    });
                    const handler3 = jest.fn(() => {
                        calls.push(handler3);
                    });

                    promise.then(null, () => {
                        handler1();
                        promise.then(null, handler3);
                    });
                    promise.then(null, handler2);

                    promise.then(null, () => {
                        // Give implementations a bit of extra time to flush their internal queue, if necessary.
                        setTimeout(() => {
                            expect(calls).toStrictEqual([handler1, handler2, handler3]);
                            done();
                        }, 5);
                    });
                });
            });
        });
    });
});
