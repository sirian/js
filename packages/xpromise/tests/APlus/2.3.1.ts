import {Adapter} from "./Adapter";
import {specify} from "./helper";


const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a `TypeError' as the reason.", () => {
    specify("via return from a fulfilled promise", done => {
        const promise = Adapter.resolved(dummy).then(() => promise);

        promise.then(null, reason => {
            expect(reason).toBeInstanceOf(TypeError);
            done();
        });
    });

    specify("via return from a rejected promise", done => {
        const promise = Adapter.rejected(dummy).then(null, () => promise);

        return promise.then(null, reason => {
            expect(reason).toBeInstanceOf(TypeError);
        });
    });
});
