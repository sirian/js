import {Func0} from "@sirian/ts-extra-types";
import {Adapter} from "./Adapter";
import {dummy, expectNotCalled, testRejected} from "./helper";

describe("2.1.3.1: When rejected, a promise: must not transition to any other state.", () => {

    const testNotChanged = (promise: PromiseLike<any>, callback: Func0) => {
        const onRejected = jest.fn();
        const onFulfilled = expectNotCalled(onRejected);
        promise.then(onFulfilled, onRejected);
        callback();
    };

    testRejected(dummy(), (promise, done) => {
        const onFulfilled = jest.fn();
        const onRejected = expectNotCalled(onFulfilled);
        promise.then(onFulfilled, onRejected);
        setTimeout(done, 1);
    });

    test("trying to reject then immediately fulfill", () => {
        const d = Adapter.deferred();

        return testNotChanged(d.promise, () => {
            d.reject(dummy());
            d.resolve(dummy());
        });
    });

    test("trying to reject then fulfill, delayed", () => {
        const d = Adapter.deferred();

        return testNotChanged(d.promise, () => {
            setTimeout(() => {
                d.reject(dummy());
                d.resolve(dummy());
            }, 1);
        });
    }, 2);

    test("trying to reject immediately then fulfill delayed", () => {
        const d = Adapter.deferred();

        return testNotChanged(d.promise, () => {
            d.reject(dummy());
            setTimeout(() => d.resolve(dummy()), 1);
        });
    }, 2);
});
