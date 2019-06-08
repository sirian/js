import {IDeferred, OnFinally, OnFulfilled, OnReject, Rejector, Resolver} from "./XPromise";

export class Deferred<T> implements IDeferred<T>, PromiseLike<T> {
    public readonly promise: PromiseLike<T>;

    protected resolver!: Resolver<T>;
    protected rejector!: Rejector;
    protected factory: PromiseConstructorLike;

    constructor(factory: PromiseConstructorLike = Promise) {
        this.factory = factory;

        this.promise = new factory((res, rej) => [this.resolver, this.rejector] = [res, rej]);
    }

    public resolve(v?: T | PromiseLike<T>) {
        this.resolver(v);
    }

    public reject(reason?: any) {
        this.rejector(reason);
    }

    public then<R1 = T, R2 = never>(onRonFulfill?: OnFulfilled<T, R1>, onReject?: OnReject<R2>) {
        return this.promise.then(onRonFulfill, onReject);
    }

    public finally(f?: OnFinally) {
        if (typeof f !== "function") {
            return this.then(f, f);
        }

        return this.then(
            (value) => this.wrap(f).then(() => value),
            (err) => this.wrap(f).then(() => { throw err; }),
        );
    }

    protected wrap<U>(fn: () => U) {
        return new this.factory<U>((resolve) => resolve(fn()));
    }
}
