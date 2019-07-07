type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type AwaitedArray<T extends any[]> = { [P in keyof T]: Awaited<T[P]> };

export type OnFulfilled<T, R> = undefined | null | ((value: T) => R | PromiseLike<R>);
export type OnReject<R> = undefined | null | ((reason: any) => R | PromiseLike<R>);
export type OnFinally = undefined | null | (() => any);
export type Resolver<T> = (value?: T | PromiseLike<T>) => void;
export type Rejector = (reason?: any) => void;
export type PromiseExecutor<T> = (resolve: Resolver<T>, reject: Rejector) => void;

export interface IDeferred<T> {
    resolve: Resolver<T>;
    reject: Rejector;
    promise: PromiseLike<T>;
}

interface PromiseReaction<T, R1 = any, R2 = any> {
    promise: XPromise<R1 | R2>;
    onFulfilled: OnFulfilled<T, R1>;
    onRejected: OnReject<R2>;
}

export enum PromiseStatus {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected",
}

declare function setTimeout(callback: (...args: any[]) => void, ms: number, ...args: any[]): any;

declare function clearTimeout(timeoutId: any): void;

export class XPromise<T = any> implements PromiseLike<T>, IDeferred<T> {
    protected status: PromiseStatus;
    protected value?: any;
    protected reactions: Array<PromiseReaction<any>>;
    protected resolved: boolean;
    protected timeout?: ReturnType<typeof setTimeout>;

    constructor(executor?: PromiseExecutor<T>) {
        this.status = PromiseStatus.PENDING;
        this.reactions = [];
        this.resolved = false;

        if ("function" === typeof executor) {
            executor(
                (value) => this.doResolve(value),
                (reason) => this.reject(reason),
            );
        }
    }

    get promise() {
        return this;
    }

    public static create<T>(executor?: PromiseExecutor<T>) {
        return new this<T>(executor);
    }

    public static resolve<T>(value?: T | PromiseLike<T>): XPromise<T> {
        if (value instanceof this) {
            return value;
        }

        return this.create((resolve) => resolve(value));
    }

    public static reject<T = never>(reason?: any): XPromise<T> {
        return this.create((resolve, reject) => reject(reason));
    }

    public static all<T extends any[]>(promises: T) {
        return this.create<AwaitedArray<T>>((resolve, reject) => {
            const length = promises.length;
            if (!length) {
                return resolve([] as any);
            }

            let fulfilledCount = 0;
            const results: Partial<AwaitedArray<T>> = [] as any;

            for (let i = 0; i < length; i++) {
                const promise = promises[i];

                const onFulfilled = (val: Awaited<T[number]>) => {
                    results[i] = val;
                    if (++fulfilledCount === length) {
                        resolve(results as AwaitedArray<T>);
                    }
                };

                this.resolve(promise).then(onFulfilled, reject);
            }
        });
    }

    // public static any<T extends any[]>(promises: T) {
    //     return this.create<AwaitedArray<T>>((resolve, reject) => {
    //         const length = promises.length;
    //         if (!length) {
    //             return resolve([] as any);
    //         }
    //
    //         let rejectedCount = 0;
    //         const errors: Partial<AwaitedArray<T>> = [] as any;
    //
    //         for (let i = 0; i < length; i++) {
    //             const promise = promises[i];
    //
    //             const onRejected = (error: any) => {
    //                 errors[i] = error;
    //                 if (++rejectedCount === length) {
    //                     reject(new AggregateError(errors));
    //                 }
    //             };
    //
    //             this.resolve(promise).then(resolve, onRejected);
    //         }
    //     });
    // }

    public static race<T extends any[]>(promises: T) {
        return this.create<Awaited<T[number]>>((resolve, reject) => {
            const length = promises.length;
            if (!length) {
                return resolve([] as any);
            }
            for (let i = 0; i < length; i++) {
                this.resolve(promises[i]).then(resolve, reject);
            }
        });
    }

    public static wrap<F extends () => any>(fn: F) {
        return XPromise.create<Awaited<ReturnType<F>>>((resolve) => resolve(fn()));
    }

    public setTimeout(ms?: number) {
        if (!this.isPending()) {
            return this;
        }

        this.clearTimeout();

        if ("number" === typeof ms) {
            const reject = () => this.reject(new Error(`Timeout ${ms}ms exceeded`));

            if (ms >= 0) {
                this.timeout = setTimeout(reject, ms);
            } else {
                reject();
            }
        }

        return this;
    }

    public clearTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            delete this.timeout;
        }
        return this;
    }

    public finally(f?: OnFinally) {
        if (typeof f !== "function") {
            return this.then(f, f);
        }

        return this.then(
            (value) => XPromise.wrap(f).then(() => value),
            (err) => XPromise.wrap(f).then(() => { throw err; }),
        );
    }

    public isPending() {
        return PromiseStatus.PENDING === this.status;
    }

    public isFulfilled() {
        return PromiseStatus.FULFILLED === this.status;
    }

    public isRejected() {
        return PromiseStatus.REJECTED === this.status;
    }

    public isSettled() {
        return !this.isPending();
    }

    public getValue() {
        if (this.isPending()) {
            throw new Error("XPromise is not settled yet");
        }
        return this.value;
    }

    public then<R1 = T, R2 = never>(onFulfilled?: OnFulfilled<T, R1>, onRejected?: OnReject<R2>) {
        const promise = XPromise.create<R1 | R2>();

        const reaction: PromiseReaction<T, R1, R2> = {
            promise,
            onFulfilled,
            onRejected,
        };

        if (this.isPending()) {
            this.reactions.push(reaction);
        } else {
            this.react(reaction);
        }

        return promise;
    }

    public catch<R = never>(onrejected?: OnReject<R>) {
        return this.then(void 0, onrejected);
    }

    public resolve(value?: T | PromiseLike<T>) {
        this.doResolve(value);
    }

    public reject(reason?: any) {
        if (this.resolved) {
            return;
        }

        this.settleRejected(reason);
    }

    protected settleFulfilled(value?: T | PromiseLike<T>) {
        this.settle(PromiseStatus.FULFILLED, value);
    }

    protected settleRejected(reason?: any) {
        this.settle(PromiseStatus.REJECTED, reason);
    }

    protected doResolve(x: any) {
        this.resolved = true;
        try {
            const type = typeof x;

            if (!x || ("object" !== type && "function" !== type)) {
                this.settleFulfilled(x);
                return;
            }

            if (x === this.promise) {
                this.settleRejected(new TypeError("Cannot resolver promise with itself"));
                return;
            }

            const thenFn = x.then;

            if ("function" !== typeof thenFn) {
                this.settleFulfilled(x);
                return;
            }

            let handled = false;

            const onFulfilled = (value: T) => {
                if (!handled) {
                    handled = true;
                    this.doResolve(value);
                }
            };

            const onRejected = (r: any) => {
                if (!handled) {
                    handled = true;
                    this.settleRejected(r);
                }
            };

            try {
                thenFn.call(x, onFulfilled, onRejected);
            } catch (e) {
                onRejected(e);
            }
        } catch (e) {
            this.settleRejected(e);
        }
    }

    protected settle(status: PromiseStatus.FULFILLED | PromiseStatus.REJECTED, value: any) {
        if (!this.isPending()) {
            return;
        }

        this.resolved = true;
        this.status = status;
        this.value = value;

        this.clearTimeout();

        for (const reaction of this.reactions) {
            this.react(reaction);
        }
    }

    protected react(reaction: PromiseReaction<T>) {
        const promise = reaction.promise;
        const value = this.value;

        try {
            if (this.isFulfilled()) {
                const fn = reaction.onFulfilled;

                if ("function" !== typeof fn) {
                    promise.settleFulfilled(value);
                } else {
                    promise.doResolve(fn(value));
                }
            }
            if (this.isRejected()) {
                const fn = reaction.onRejected;

                if ("function" !== typeof fn) {
                    promise.settleRejected(value);
                } else {
                    promise.doResolve(fn(value));
                }
            }
        } catch (e) {
            promise.reject(e);
        }
    }
}
