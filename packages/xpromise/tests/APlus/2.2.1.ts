import {Adapter} from "./Adapter";
import {specify} from "./helper";


const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.2.1: Both `onFulfilled` and `onRejected` are optional arguments.", () => {
    const data: Array<[any, string]> = [
        [undefined, "`undefined`"],
        [null, "`null`"],
        [false, "`false`"],
        [5, "`5`"],
        [{}, "an object"],
    ];

    describe("2.2.1.1: If `onFulfilled` is not a function, it must be ignored.", () => {
        describe.each(data)("applied to a directly-rejected promise", (nonFunction, stringRepresentation) => {
            specify("`onFulfilled` is " + stringRepresentation, done => {
                Adapter.rejected(dummy).then(nonFunction, () => {
                    done();
                });
            });
        });

        describe.each(data)("applied to a promise rejected and then chained off of", (nonFunction, stringRepresentation) => {
            specify("`onFulfilled` is " + stringRepresentation, (done) => {
                Adapter.rejected(dummy).then(() => { }, undefined).then(nonFunction, done);
            });
        });
    });

    describe("2.2.1.2: If `onRejected` is not a function, it must be ignored.", () => {
        describe.each(data)("applied to a directly-fulfilled promise", (nonFunction, stringRepresentation) => {
            specify("`onRejected` is " + stringRepresentation, (done) => {
                Adapter.resolved(dummy).then(done, nonFunction);
            });
        });

        describe.each(data)("applied to a promise fulfilled and then chained off of", (nonFunction, stringRepresentation) => {
            specify("`onFulfilled` is " + stringRepresentation, done => {
                Adapter.resolved(dummy).then(undefined, () => void 0).then(done, nonFunction);
            });
        });
    });
});
