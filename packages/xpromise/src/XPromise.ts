import {Awaited, AwaitedArray, Func, Func1} from "@sirian/ts-extra-types";

export type OnFulfill<T, R> = undefined | null | ((value: T) => R | PromiseLike<R>);
export type OnReject<R> = undefined | null | ((reason: any) => R | PromiseLike<R>);
export type OnFinally = undefined | null | (() => any);
export type Resolver<T> = (value?: T | PromiseLike<T>) => void;
export type Rejector = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: Resolver<T>, reject: Rejector) => void;
export type AllSettled<T extends any[]> = {
    [P in keyof T]:
    { status: "fulfilled", value: Awaited<T[P]> } |
    { status: "rejected", reason: any }
};

export interface IDeferred<T> {
    resolve: Resolver<T>;
    reject: Rejector;
    promise: PromiseLike<T>;
}

export type PromiseReaction<T, R1 = any, R2 = any> = [
    promise: XPromise<R1 | R2>,
    onFulfilled: OnFulfill<T, R1>,
    onRejected: OnReject<R2>,
];

const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

export type PromiseStatus = "pending" | "fulfilled" | "rejected";

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

const isFunction = (x: any): x is Func => "function" === typeof x;

export class XPromise<T = any> implements PromiseLike<T>, IDeferred<T> {
    public readonly promise = this;

    private _status: PromiseStatus = PENDING;
    private _reactions: Array<PromiseReaction<any>> = [];
    private _resolved = false;
    private _timeout?: any;
    private _value?: any;

    constructor(executor?: PromiseExecutor<T>) {
        if (isFunction(executor)) {
            executor(
                (value) => this._doResolve(value),
                (reason) => this.reject(reason),
            );
        }
    }

    public static any<T>(it: Iterable<T | PromiseLike<T>>) {
        return new XPromise<T>((resolve, reject) => {
            const promises = [...it];

            const length = promises.length;

            if (!length) {
                return resolve([] as any);
            }

            let rejectedCount = 0;
            const errors: any[] = [];

            for (let i = 0; i < length; i++) {
                const promise = promises[i];

                const onRejected = (error: any) => {
                    errors[i] = error;
                    if (++rejectedCount === length) {
                        reject(new AggregateError(errors, "All promises were rejected"));
                    }
                };

                XPromise.resolve(promise).then(resolve, onRejected);
            }
        });
    }

    public static create<T>(executor?: PromiseExecutor<T>) {
        return new XPromise<T>(executor);
    }

    public static resolve<T>(value?: T | PromiseLike<T>): XPromise<T> {
        return value instanceof XPromise
               ? value
               : new XPromise((resolve) => resolve(value));
    }

    public static reject<T = never>(reason?: any): XPromise<T> {
        return new XPromise((resolve, reject) => reject(reason));
    }

    public static all<T extends any[]>(promises: T) {
        return new XPromise<AwaitedArray<T>>((resolve, reject) => {
            const length = promises.length;

            if (!length) {
                return resolve([] as any);
            }

            let fulfilledCount = 0;
            const results = Array(length);

            for (let i = 0; i < length; i++) {
                const promise = promises[i];

                const onFulfilled = (val: Awaited<T[number]>) => {
                    results[i] = val;
                    if (++fulfilledCount === length) {
                        resolve(results as AwaitedArray<T>);
                    }
                };

                XPromise.resolve(promise).then(onFulfilled, reject);
            }
        });
    }

    public static allSettled<T extends any[]>(promises: T) {
        return XPromise.wrap(() => {
            const wrapped = promises
                .map(XPromise.resolve)
                .map((promise) => promise.then(
                    (value) => ({status: FULFILLED, value}),
                    (reason) => ({status: REJECTED, reason}),
                ));

            return XPromise.all(wrapped);
        }) as XPromise<AllSettled<T>>;
    }

    public static race<T extends any[]>(promises: T) {
        return new XPromise((resolve, reject) => {
            if (!promises.length) {
                return resolve([] as any);
            }
            for (const promise of promises) {
                XPromise.resolve(promise).then(resolve, reject);
            }
        }) as XPromise<Awaited<T[number]>>;
    }

    public static wrap<R>(fn: () => R | PromiseLike<R>): XPromise<R> {
        try {
            const value = fn();
            return XPromise.resolve<R>(value);
        } catch (e) {
            return XPromise.reject(e);
        }
    }

    public setTimeout(ms: number, fn?: Func1<any, this>): this {
        if (!this.isPending()) {
            return this;
        }

        this.clearTimeout();

        this._timeout = setTimeout(() => {
            let error;

            try {
                error = fn && fn(this);
            } catch (e) {
                error = e;
            }

            this.reject(error ?? new Error("Timeout " + ms + "ms"));
        }, ms);

        return this;
    }

    public clearTimeout(): this {
        if (this._timeout) {
            clearTimeout(this._timeout);
            delete this._timeout;
        }
        return this;
    }

    public finally(f?: OnFinally) {
        if (!isFunction(f)) {
            return this.then(f, f);
        }

        return this.then(
            (value) => XPromise.wrap(f).then(() => value),
            (err) => XPromise.wrap(f).then(() => { throw err; }),
        );
    }

    public isPending() {
        return PENDING === this._status;
    }

    public isFulfilled() {
        return FULFILLED === this._status;
    }

    public isRejected() {
        return REJECTED === this._status;
    }

    public isSettled() {
        return !this.isPending();
    }

    public getValue() {
        const {_value} = this;
        if (this.isFulfilled()) {
            return _value;
        }
        throw this.isRejected() ? _value : new Error("Could not get value of pending promise");
    }

    public then<R1 = T, R2 = never>(onFulfilled?: OnFulfill<T, R1>, onRejected?: OnReject<R2>) {
        const promise = new XPromise<R1 | R2>();

        const reaction: PromiseReaction<T, R1, R2> = [promise, onFulfilled, onRejected];

        if (this.isPending()) {
            this._reactions.push(reaction);
        } else {
            this.react(reaction);
        }

        return promise;
    }

    public catch<R = never>(onRejected?: OnReject<R>) {
        return this.then(null, onRejected);
    }

    public resolve(value?: T | PromiseLike<T>) {
        this._doResolve(value);
    }

    public reject(reason?: any) {
        if (!this._resolved) {
            this._settleRejected(reason);
        }
    }

    protected react(reaction: PromiseReaction<T>) {
        const [promise, onFulfilled, onRejected] = reaction;
        const value = this._value;

        try {
            if (this.isFulfilled()) {
                if (!isFunction(onFulfilled)) {
                    promise._settleFulfilled(value);
                } else {
                    promise._doResolve(onFulfilled(value));
                }
            }
            if (this.isRejected()) {
                if (!isFunction(onRejected)) {
                    promise._settleRejected(value);
                } else {
                    promise._doResolve(onRejected(value));
                }
            }
        } catch (e) {
            promise.reject(e);
        }
    }

    private _settleFulfilled(value?: T | PromiseLike<T>) {
        this._settle(FULFILLED, value);
    }

    private _settleRejected(reason?: any) {
        this._settle(REJECTED, reason);
    }

    private _doResolve(x: any) {
        this._resolved = true;
        try {
            if (null === x || ("object" !== typeof x && !isFunction(x))) {
                this._settleFulfilled(x);
                return;
            }

            if (x === this.promise) {
                this._settleRejected(new TypeError("Cannot resolver promise with itself"));
                return;
            }

            const thenFn = x.then;

            if (!isFunction(thenFn)) {
                this._settleFulfilled(x);
                return;
            }

            let handled = 0;

            const onFulfilled = (value: T) => handled++ || this._doResolve(value);
            const onRejected = (r: any) => handled++ || this._settleRejected(r);

            try {
                thenFn.call(x, onFulfilled, onRejected);
            } catch (e) {
                onRejected(e);
            }
        } catch (e) {
            this._settleRejected(e);
        }
    }

    private _settle(status: "fulfilled" | "rejected", value: any) {
        if (!this.isPending()) {
            return;
        }

        this._resolved = true;
        this._status = status;
        this._value = value;

        this.clearTimeout();

        this._reactions.splice(0).forEach((r) => this.react(r));
    }
}
