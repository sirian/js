import {ArrayRO, Awaited, AwaitedArray, Func, Func1} from "@sirian/ts-extra-types";

export type OnFulfill<T, R> = undefined | null | ((value: T) => R | PromiseLike<R>);
export type OnReject<R> = undefined | null | ((reason: any) => R | PromiseLike<R>);
export type OnFinally = undefined | null | (() => any);
export type Resolver<T> = (value?: T | PromiseLike<T>) => void;
export type Rejector = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: Resolver<T>, reject: Rejector) => void;
export type AllSettled<T extends ArrayRO> = {
    [P in keyof T]: PromiseSettledResult<Awaited<T[P]>>
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

export type PromiseStatus = "pending" | "fulfilled" | "rejected";

declare function setTimeout(callback: (...args: any[]) => void, ms: number): unknown;

declare function clearTimeout(timeoutId: unknown): void;

const isFunction = (x: any): x is Func => "function" === typeof x;

export class XPromise<T = any> implements PromiseLike<T>, IDeferred<T> {
    public readonly promise = this;

    private _status: PromiseStatus = "pending";
    private _reactions: Array<PromiseReaction<any>> = [];
    private _resolved = false;
    private _timeoutId?: unknown;
    private _value?: any;
    private _timedOut = false;

    constructor(executor?: PromiseExecutor<T>) {
        if (isFunction(executor)) {
            try {
                executor(
                    (value) => this._doResolve(value),
                    (reason) => this.reject(reason),
                );
            } catch (e) {
                this.reject(e);
            }
        }
    }

    public static any<T>(it: Iterable<T | PromiseLike<T>>) {
        return new XPromise<T>((resolve, reject) => {
            const promises = [...it];

            const length = promises.length;
            const errors: any[] = [];
            const rejectAll = () => reject(new AggregateError(errors, "All promises were rejected"));

            if (!length) {
                return rejectAll();
            }

            let rejectedCount = 0;

            for (let i = 0; i < length; i++) {
                const promise = promises[i];

                const onRejected = (error: any) => {
                    errors[i] = error;
                    if (++rejectedCount === length) {
                        rejectAll();
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

    public static all<T extends ArrayRO>(promises: T) {
        return new XPromise<AwaitedArray<T>>((resolve, reject) => {
            const length = promises.length;

            if (!length) {
                return resolve([] as any);
            }

            let fulfilledCount = 0;

            const results: unknown[] = [];

            for (let i = 0; i < length; i++) {
                XPromise
                    .resolve(promises[i])
                    .then((val) => {
                        results[i] = val;
                        if (++fulfilledCount === length) {
                            resolve(results as any);
                        }
                    }, reject);
            }
        });
    }

    public static allSettled<T extends ArrayRO>(promises: T): XPromise<AllSettled<T>> {
        return XPromise.all(promises.map((v) => XPromise.resolve(v).then(
            (value) => ({status: "fulfilled", value}),
            (reason) => ({status: "rejected", reason}),
        ))) as any;
    }

    public static race<T extends ArrayRO>(promises: T): XPromise<Awaited<T[number]>> {
        return new XPromise<any>((resolve, reject) =>
            [...promises].forEach((p) => {
                XPromise.resolve(p).then(resolve, reject);
            }));
    }

    public static wrap<R>(fn: () => R | PromiseLike<R>): XPromise<R> {
        try {
            return XPromise.resolve(fn());
        } catch (e) {
            return XPromise.reject(e);
        }
        return new XPromise<R>((resolve) => resolve(fn()));
    }

    public setTimeout(ms: number, fn?: Func1<any, this>): this {
        if (!this.isPending()) {
            return this;
        }

        this._timedOut = false;
        void this.clearTimeout();

        this._timeoutId = setTimeout(() => {
            void this.clearTimeout();
            this._timedOut = true;
            let error;

            try {
                error = fn?.(this);
            } catch (e) {
                error = e;
            }

            if (this._timedOut) {
                this.reject(error ?? new Error("XPromise timeout exceeded"));
            }
        }, ms);

        return this;
    }

    public clearTimeout(): this {
        clearTimeout(this._timeoutId);
        delete this._timeoutId;
        return this;
    }

    public finally(f?: OnFinally) {
        return !isFunction(f)
               ? this.then(f, f)
               : this.then(
                (value) => XPromise.wrap(f).then(() => value),
                (err) => XPromise.wrap(f).then(() => { throw err; }));
    }

    public isPending() {
        return "pending" === this._status;
    }

    public isFulfilled() {
        return "fulfilled" === this._status;
    }

    public isRejected() {
        return "rejected" === this._status;
    }

    public isSettled() {
        return !this.isPending();
    }

    public isTimedOut() {
        return this._timedOut;
    }

    public getValue() {
        if (this.isFulfilled()) {
            return this._value;
        }
        throw this.isRejected() ? this._value : new Error("Could not get value of pending promise");
    }

    public then<R1 = T, R2 = never>(onFulfilled?: OnFulfill<T, R1>, onRejected?: OnReject<R2>) {
        const promise = new XPromise<R1 | R2>();

        const reaction: PromiseReaction<T, R1, R2> = [promise, onFulfilled, onRejected];

        if (this.isPending()) {
            this._reactions.push(reaction);
        } else {
            this._react(reaction);
        }

        return promise;
    }

    public catch<R = never>(onRejected?: OnReject<R>) {
        // eslint-disable-next-line unicorn/no-null
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

    protected _react(reaction: PromiseReaction<T>) {
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
        this._settle("fulfilled", value);
    }

    private _settleRejected(reason?: any) {
        this._settle("rejected", reason);
    }

    private _doResolve(x: any) {
        this._resolved = true;
        try {
            if (null === x || ("object" !== typeof x && !isFunction(x))) {
                this._settleFulfilled(x);
                return;
            }

            if (x === this.promise) {
                this._settleRejected(new TypeError("Chaining cycle detected for XPromise"));
                return;
            }

            const thenFn = x.then;

            if (!isFunction(thenFn)) {
                this._settleFulfilled(x);
                return;
            }

            let calls = 0;

            const onFulfilled = (value: T) => calls++ || this._doResolve(value);
            const onRejected = (r: any) => calls++ || this._settleRejected(r);

            try {
                thenFn.call(x, onFulfilled, onRejected);
            } catch (e) {
                onRejected(e);
            }
        } catch (e) {
            this._settleRejected(e);
        }
    }

    private _settle(status: "fulfilled" | "rejected", value: unknown) {
        if (!this.isPending()) {
            return;
        }

        this._resolved = true;
        this._status = status;
        this._value = value;

        void this.clearTimeout();

        this._reactions.splice(0).forEach((r) => this._react(r));
    }
}
