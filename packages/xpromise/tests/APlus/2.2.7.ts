import {isObjectOrFunction} from "@sirian/common";
import {Adapter} from "./Adapter";
import {specify, testFulfilled, testReasons, testRejected} from "./helper";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it
const sentinel = {sentinel: "sentinel"}; // a sentinel fulfillment value to test for with strict equality
const other = {other: "other"}; // a value we don't want to be strict equal to

describe("2.2.7: `then` must return a promise: `promise2 = promise1.then(onFulfilled, onRejected)`", () => {
    specify("is a promise", () => {
        const promise1 = Adapter.deferred().promise;
        const promise2 = promise1.then();

        expect(isObjectOrFunction(promise2)).toBeTruthy();
        expect(promise2).not.toBe(promise1);
        expect(typeof promise2.then).toBe("function");
    });

    describe("2.2.7.1: If either `onFulfilled` or `onRejected` returns a value `x`, run the Promise Resolution " +
        "Procedure `[[Resolve]](promise2, x)`", () => {
        specify("see separate 3.3 tests", () => { });
    });

    describe("2.2.7.2: If either `onFulfilled` or `onRejected` throws an exception `e`, `promise2` must be rejected " +
        "with `e` as the reason.", () => {
        function testReason(expectedReason: any, stringRepresentation: string) {
            describe("The reason is " + stringRepresentation, () => {
                testFulfilled(dummy, (promise1, done) => {
                    const promise2 = promise1.then(() => {
                        throw expectedReason;
                    });

                    promise2.then(null, (actualReason) => {
                        expect(actualReason).toBe(expectedReason);
                        done();
                    });
                });
                testRejected(dummy, (promise1, done) => {
                    const promise2 = promise1.then(null, () => {
                        throw expectedReason;
                    });

                    promise2.then(null, (actualReason) => {
                        expect(actualReason).toBe(expectedReason);
                        done();
                    });
                });
            });
        }

        testReasons(testReason);
    });

    describe("2.2.7.3: If `onFulfilled` is not a function and `promise1` is fulfilled, `promise2` must be fulfilled " +
        "with the same value.", () => {

        function testNonFunction(nonFunction: any, stringRepresentation: string) {
            describe("`onFulfilled` is " + stringRepresentation, () => {
                testFulfilled(sentinel, (promise1, done) => {
                    const promise2 = promise1.then(nonFunction);

                    promise2.then((value) => {
                        expect(value).toBe(sentinel);
                        done();
                    });
                });
            });
        }

        testNonFunction(undefined, "`undefined`");
        testNonFunction(null, "`null`");
        testNonFunction(false, "`false`");
        testNonFunction(5, "`5`");
        testNonFunction({}, "an object");
        testNonFunction([() => other], "an array containing a function");
    });

    describe("2.2.7.4: If `onRejected` is not a function and `promise1` is rejected, `promise2` must be rejected " +
        "with the same reason.", () => {

        function testNonFunction(nonFunction: any, stringRepresentation: string) {
            describe("`onRejected` is " + stringRepresentation, () => {
                testRejected(sentinel, (promise1, done) => {
                    const promise2 = promise1.then(null, nonFunction);

                    promise2.then(null, (reason) => {
                        expect(reason).toBe(sentinel);
                        done();
                    });
                });
            });
        }

        testNonFunction(undefined, "`undefined`");
        testNonFunction(null, "`null`");
        testNonFunction(false, "`false`");
        testNonFunction(5, "`5`");
        testNonFunction({}, "an object");
        testNonFunction([() => other], "an array containing a function");
    });
});
