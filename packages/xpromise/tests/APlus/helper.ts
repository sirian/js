import {Func, Func0, MaybePromise} from "@sirian/ts-extra-types";
import {Adapter} from "./Adapter";

export type DoneCallback = Func0;
export type DoneAwareCallback = (done: DoneCallback) => any;

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

    for (const [name, fn] of Object.entries(reasons)) {
        callback(fn(), name);
    }
};

export const expectNotCalled = (fn: Func) => () => expect(fn).not.toHaveBeenCalled();

export const specify = (name: string, fn: DoneAwareCallback, timeout = 0) => {
    test(name, fn.length === 0 ? fn : (done) => {
        fn(() => done());
        // setTimeout(done, timeout);
    }, 20);
};

export const testFulfilled: {
    <T>(value: MaybePromise<T>, fn: (value: PromiseLike<T>, done: DoneCallback) => void): void;
    <T>(value: MaybePromise<T>, fn: (value: PromiseLike<T>) => any): void
} = (value: any, fn: Function) => {
    specify("already-fulfilled", fn.bind(null, Adapter.resolved(value)));

    specify("immediately-fulfilled", 1 === fn.length ? () => {
        const d = Adapter.deferred();
        try {
            return fn(d.promise);
        } finally {
            d.resolve(value);
        }

    } : (done) => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        d.resolve(value);
    });

    specify("eventually-fulfilled", 1 === fn.length ? () => {
        const d = Adapter.deferred();
        try {
            return fn(d.promise);
        } finally {
            setTimeout(() => d.resolve(value), 1);
        }
    } : (done) => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        setTimeout(() => d.resolve(value), 1);
    });
};

export const dummy = () => ({dummy: "dummy"});

export const testRejected: {
    (reason: any, fn: (value: PromiseLike<any>, done: DoneCallback) => void): void;
    (reason: any, fn: (value: PromiseLike<any>) => any): void
} = (reason: any, fn: Function) => {
    test("already-rejected", fn.bind(null, Adapter.rejected(reason)));

    test("immediately-rejected", 1 === fn.length ? () => {
        const d = Adapter.deferred();
        try {
            return fn(d.promise);
        } finally {
            d.reject(reason);
        }
    } : (done) => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        d.reject(reason);
    });

    test("eventually-rejected", 1 === fn.length ? () => {
        const d = Adapter.deferred();
        try {
            return fn(d.promise);
        } finally {
            setTimeout(() => d.reject(reason), 1);
        }
    } : (done) => {
        const d = Adapter.deferred();
        fn(d.promise, done);
        setTimeout(() => d.reject(reason), 1);
    });
};

export const thenables: Record<string, Record<string, (value: any) => { then: (onFulfilled: any, onRejected: any) => any }>> = {
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
                            return (onFulfilled: any) => onFulfilled(value);
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
            setTimeout(() => d.resolve(value), 1);
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
                            return (onFulfilled: any, onRejected: any) => onRejected(reason);
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
            setTimeout(() => d.reject(reason), 1);

            return d.promise;
        },
    },
};
