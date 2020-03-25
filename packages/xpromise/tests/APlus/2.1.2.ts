import {Adapter} from "./Adapter";
import {specify, testFulfilled} from "./helper";


const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.1.2.1: When fulfilled, a promise: must not transition to any other state.", () => {
    testFulfilled(dummy, (promise, done) => {
        let onFulfilledCalled = false;

        promise.then(() => {
            onFulfilledCalled = true;
        }, () => {
            expect(onFulfilledCalled).toBe(false);
            done();
        });
    });

    specify("trying to fulfill then immediately reject", done => {
        const d = Adapter.deferred();
        let onFulfilledCalled = false;

        d.promise.then(() => {
            onFulfilledCalled = true;
        }, () => {
            expect(onFulfilledCalled).toBe(false);
            done();
        });

        d.resolve(dummy);
        d.reject(dummy);

    });

    specify("trying to fulfill then reject, delayed", done => {
        const d = Adapter.deferred();
        let onFulfilledCalled = false;

        d.promise.then(() => {
            onFulfilledCalled = true;
        }, () => {
            expect(onFulfilledCalled).toBe(false);
            done();
        });

        setTimeout(() => {
            d.resolve(dummy);
            d.reject(dummy);
        }, 5);

    });

    specify("trying to fulfill immediately then reject delayed", done => {
        const d = Adapter.deferred();
        let onFulfilledCalled = false;

        d.promise.then(() => {
            onFulfilledCalled = true;
        }, () => {
            expect(onFulfilledCalled).toBe(false);
            done();
        });

        d.resolve(dummy);
        setTimeout(() => d.reject(dummy), 5);

    });
});
