import {IDeferred, OnFinally, OnFulfill, OnReject, Rejector, Resolver} from "./XPromise";

export class Deferred<T> implements IDeferred<T>, PromiseLike<T> {
    public readonly promise: PromiseLike<T>;

    private _resolver!: Resolver<T>;
    private _rejector!: Rejector;
    private readonly _factory: PromiseConstructorLike;

    constructor(factory: PromiseConstructorLike = Promise) {
        this._factory = factory;

        this.promise = new factory((res, rej) => {
            this._resolver = res as Resolver<T>;
            this._rejector = rej;
        });
    }

    public resolve(v?: T | PromiseLike<T>) {
        this._resolver(v);
    }

    public reject(reason?: any) {
        this._rejector(reason);
    }

    public then<R1 = T, R2 = never>(onFulfill?: OnFulfill<T, R1>, onReject?: OnReject<R2>) {
        return this.promise.then(onFulfill, onReject);
    }

    public finally(f?: OnFinally) {
        if (typeof f !== "function") {
            return this.then(f, f);
        }

        return this.then(
            (value) => this._wrap(f).then(() => value),
            (err) => this._wrap(f).then(() => { throw err; }),
        );
    }

    private _wrap<U>(fn: () => U) {
        return new this._factory<U>((resolve) => resolve(fn()));
    }
}
