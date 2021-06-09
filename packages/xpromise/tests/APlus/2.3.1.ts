import {Adapter} from "./Adapter";

const dummy = {dummy: "dummy"}; // we fulfill or reject with this when we don't intend to test against it

describe("2.3.1: If `promise` and `x` refer to the same object, reject `promise` with a `TypeError' as the reason.", () => {
    test("via return from a fulfilled promise", (done) => {
        const promise: any = Adapter.resolved(dummy).then(() => promise);

        promise.then(null, (reason: any) => {
            expect(reason).toBeInstanceOf(TypeError);
            done();
        });

        setTimeout(done, 1);
    });

    test("via return from a rejected promise", (done) => {
        const promise: any = Adapter.rejected(dummy).then(null, () => promise);

        promise.then(null, (reason: any) => {
            expect(reason).toBeInstanceOf(TypeError);
        });

        setTimeout(done, 1);
    });
});
