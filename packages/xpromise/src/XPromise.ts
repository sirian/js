import {ArrayRO, Awaited, AwaitedArray, Func, Func1, MaybePromise} from "@sirian/ts-extra-types";

export type OnFulfill<T, R> = undefined | null | ((value: T) => MaybePromise<R>);
export type OnReject<R> = undefined | null | ((reason: any) => MaybePromise<R>);
export type OnFinally = undefined | null | (() => any);
export type Resolver<T> = (value?: MaybePromise<T>) => void;
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

export type PromiseState = "pending" | "fulfilled" | "rejected";

declare function setTimeout(callback: (...args: any[]) => void, ms: number): unknown;

declare function clearTimeout(timeoutId: unknown): void;

const isFunction = (x: any): x is Func => "function" === typeof x;

export class XPromise<T = any> implements PromiseLike<T>, IDeferred<T> {
    public readonly promise = this;

    private _state: PromiseState = "pending";
    private _reactions: Array<PromiseReaction<any>> = [];
    private _resolved = false;
    private _timeoutId?: unknown;
    private _value?: unknown;
    private _timedOut = false;

    constructor(executor?: PromiseExecutor<T>) {
        if (isFunction(executor)) {
            try {
                executor(
                    (value) => this.resolve(value),
                    (reason) => this.reject(reason),
                );
            } catch (e) {
                this.reject(e);
            }
        }
    }

    public static any<T>(it: Iterable<MaybePromise<T>>) {
        return new this<T>((resolve, reject) => {
            const promises = [...it];
            const errors: unknown[] = [];
            const rejectAll = () => reject(new AggregateError(errors, "All promises were rejected"));
            let rejectedCount = 0;

            promises.forEach((promise, i, {length}) => {
                XPromise
                    .resolve(promise)
                    .then(resolve, (error) => {
                        errors[i] = error;
                        if (++rejectedCount === length) {
                            rejectAll();
                        }
                    });
            });

            if (!promises.length) {
                rejectAll();
            }
        });
    }

    public static create<T>(executor?: PromiseExecutor<T>) {
        return new this<T>(executor);
    }

    public static resolve<T>(value?: MaybePromise<T>) {
        return value instanceof this ? value : new this<T>((resolve) => resolve(value));
    }

    public static reject<T = never>(reason?: any) {
        return new this<T>((resolve, reject) => reject(reason));
    }

    public static all<T extends ArrayRO>(promises: T) {
        return new this<AwaitedArray<T>>((resolve, reject) => {
            let fulfilledCount = 0;
            const results: unknown[] = [];
            const checkResolve = () => fulfilledCount === promises.length && resolve(results as any);

            promises.forEach((promise, i) => {
                XPromise.resolve(promise).then((val) => {
                    results[i] = val;
                    ++fulfilledCount;
                    checkResolve();
                }, reject);
            });

            checkResolve();
        });
    }

    // public static allSettled<T extends readonly unknown[] | readonly [unknown]>(values: T):
    //     Promise<{ -readonly [P in keyof T]: PromiseSettledResult<T[P] extends PromiseLike<infer U> ? U : T[P]> }>;
    // public static allSettled<T>(values: Iterable<T>): Promise<PromiseSettledResult<T extends PromiseLike<infer U> ? U : T>[]>;

    public static allSettled(promises: Iterable<unknown>) {
        return this.all([...promises].map((v) => XPromise.resolve(v).then(
            (value): PromiseSettledResult<unknown> => ({status: "fulfilled", value}),
            (reason): PromiseSettledResult<unknown> => ({status: "rejected", reason}),
        )));
    }

    public static race<T extends ArrayRO>(promises: T): XPromise<Awaited<T[number]>> {
        return new this((resolve, reject) =>
            [...promises].forEach((p) => {
                XPromise.resolve(p).then(resolve, reject);
            }));
    }

    public static wrap<R>(fn: () => MaybePromise<R>): XPromise<R> {
        try {
            return this.resolve<R>(fn());
        } catch (e) {
            return this.reject(e);
        }
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
        return this.then(
            isFunction(f) ? (value) => XPromise.wrap(f).then(() => value) : f,
            isFunction(f) ? (err) => XPromise.wrap(f).then(() => { throw err; }) : f,
        );
    }

    public isPending() {
        return "pending" === this._state;
    }

    public isFulfilled() {
        return "fulfilled" === this._state;
    }

    public isRejected() {
        return "rejected" === this._state;
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

    public resolve(x?: MaybePromise<T>): void
    public resolve(x?: any) {
        this._resolved = true;
        try {
            if (null === x || ("object" !== typeof x && !isFunction(x))) {
                this._settle(false, x);
                return;
            }

            if (x === this.promise) {
                this._settle(true, new TypeError("Chaining cycle detected for XPromise"));
                return;
            }

            const thenFn = x.then;

            if (!isFunction(thenFn)) {
                this._settle(false, x);
                return;
            }

            let calls = 0;

            const onFulfilled = (value: T) => calls++ || this.resolve(value);
            const onRejected = (r: any) => calls++ || this._settle(true, r);

            try {
                thenFn.call(x, onFulfilled, onRejected);
            } catch (e) {
                onRejected(e);
            }
        } catch (e) {
            this._settle(true, e);
        }
    }

    public reject(reason?: any) {
        !this._resolved && this._settle(true, reason);
    }

    protected _react(reaction: PromiseReaction<T>) {
        const [promise, onFulfilled, onRejected] = reaction;
        const value = this._value;

        try {
            if (this.isFulfilled()) {
                if (!isFunction(onFulfilled)) {
                    promise._settle(false, value);
                } else {
                    promise.resolve(onFulfilled(value as T));
                }
            }
            if (this.isRejected()) {
                if (!isFunction(onRejected)) {
                    promise._settle(true, value);
                } else {
                    promise.resolve(onRejected(value));
                }
            }
        } catch (e) {
            promise.reject(e);
        }
    }

    private _settle(rejected: boolean, value: unknown) {
        if (!this.isPending()) {
            return;
        }

        this._resolved = true;
        this._state = rejected ? "rejected" : "fulfilled";
        this._value = value;


        // noinspection JSIgnoredPromiseFromCall
        this.clearTimeout(); // eslint-disable-line @typescript-eslint/no-floating-promises

        this._reactions.splice(0).forEach((r) => this._react(r));
    }
}

