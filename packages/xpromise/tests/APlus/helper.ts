import {entriesOf} from "@sirian/common";
import {Func, Func0} from "@sirian/ts-extra-types";
import {Adapter} from "./Adapter";

type DoneAwareCallback = (cb: Func0) => any;

export const testReasons = (callback: (value: any, name: string) => any) => {
    const reasons = {
        "`undefined`": () => undefined,
        "`null`": () => null,
        "`false`": () => false,
        "`0`": () => 0,
        "an error": () => new Error(),
        "an error without a stack": () => {
            const error = new Error();
            delete error.stack;
            return error;
        },
        "a date": () => new Date(),
        "an object": () => ({}),
        "an always-pending thenable": () => ({then: () => { }}),
        "a fulfilled promise": () => Adapter.resolved({dummy: "fulfilled"}),
        "a rejected promise": () => Adapter.rejected({dummy: "rejected"}),
    };

    for (const [name, fn] of entriesOf(reasons)) {
        callback(fn(), name);
    }
};

export const expectNotCalled = (fn: Func) => () => expect(fn).not.toHaveBeenCalled();

export const specify = (name: string, fn: DoneAwareCallback, timeout = 10) => {
    test(name, (done) => {
        setTimeout(done, timeout);
        fn(() => done())
        // Promise.resolve(result).then(() => done(), () => done());
    }, timeout);
};

export const testFulfilled = (value, fn: (promise: PromiseLike<any>, done: Func0) => any) => {
    specify("already-fulfilled", done => fn(Adapter.resolved(value), done));

    specify("immediately-fulfilled", done => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        d.resolve(value);
    });

    specify("eventually-fulfilled", done => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        setTimeout(() => d.resolve(value), 5);
    });
};

export const dummy = () => ({dummy: "dummy"});

export const testRejected = (reason, fn) => {
    specify("already-rejected", done => fn(Adapter.rejected(reason), done));

    specify("immediately-rejected", done => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        d.reject(reason);
    });

    specify("eventually-rejected", done => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        setTimeout(() => d.reject(reason), 5);
    });
};

export const thenables = {
    fulfilled: {
        "a synchronously-fulfilled custom thenable": (value) => ({
            then(onFulfilled) {
                onFulfilled(value);
            },
        }),

        "an asynchronously-fulfilled custom thenable": (value) => ({
            then(onFulfilled) {
                setTimeout(() => onFulfilled(value), 0);
            },
        }),

        "a synchronously-fulfilled one-time thenable": (value) => {
            let numberOfTimesThenRetrieved = 0;
            return Object.create(null, {
                then: {
                    get() {
                        if (numberOfTimesThenRetrieved === 0) {
                            ++numberOfTimesThenRetrieved;
                            return onFulfilled => onFulfilled(value);
                        }
                        return null;
                    },
                },
            });
        },

        "a thenable that tries to fulfill twice": (value) => ({
            then(onFulfilled) {
                onFulfilled(value);
                onFulfilled({other: "other"});
            },
        }),

        "a thenable that fulfills but then throws": (value) => ({
            then(onFulfilled) {
                onFulfilled(value);
                throw {other: "other"};
            },
        }),

        "an already-fulfilled promise": (value) => Adapter.resolved(value),

        "an eventually-fulfilled promise": (value) => {
            const d = Adapter.deferred();
            setTimeout(() => d.resolve(value), 5);
            return d.promise;
        },
    },

    rejected: {
        "a synchronously-rejected custom thenable": (reason) => ({
            then(onFulfilled, onRejected) {
                onRejected(reason);
            },
        }),

        "an asynchronously-rejected custom thenable": (reason) => ({
            then(onFulfilled, onRejected) {
                setTimeout(() => onRejected(reason), 0);
            },
        }),

        "a synchronously-rejected one-time thenable": (reason) => {
            let numberOfTimesThenRetrieved = 0;
            return Object.create(null, {
                then: {
                    get() {
                        if (numberOfTimesThenRetrieved === 0) {
                            ++numberOfTimesThenRetrieved;
                            return (onFulfilled, onRejected) => onRejected(reason);
                        }
                        return null;
                    },
                },
            });
        },

        "a thenable that immediately throws in `then`": (reason) => ({
            then() {
                throw reason;
            },
        }),

        "an object with a throwing `then` accessor": (reason) =>
            Object.create(null, {
                then: {
                    get() {
                        throw reason;
                    },
                },
            }),

        "an already-rejected promise": (reason) => Adapter.rejected(reason),

        "an eventually-rejected promise"(reason) {
            const d = Adapter.deferred();
            setTimeout(() => d.reject(reason), 5);

            return d.promise;
        },
    },
};
