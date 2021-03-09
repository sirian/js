import {sortMap, throwError} from "@sirian/common";
import {XPromise} from "@sirian/xpromise";

export type ListenerCallback<A extends any[]> = (...args: A) => any;

export interface ListenerSetOptions<A extends any[]> {
    onError: (error: any, args: A, fn: ListenerCallback<A>) => any;
}

export interface ListenerOptions {
    priority?: number;
    once?: boolean;
}

export class Dispatcher<A extends any[] = any> {
    private readonly _map = new Map<ListenerCallback<A>, Required<ListenerOptions>>();
    private _dirty: boolean = false;
    private readonly _options: ListenerSetOptions<A>;

    constructor(options: Partial<ListenerSetOptions<A>> = {}) {
        this._options = {
            onError: (e, args, fn) => throwError(e, {fn, args}),
            ...options,
        };
    }

    public get size() {
        return this._map.size;
    }

    public once(fn: ListenerCallback<A>, opts?: ListenerOptions) {
        return this.addListener(fn, {...opts, once: true});
    }

    public addListener(fn: ListenerCallback<A>, opts?: ListenerOptions) {
        this._map.set(fn, {
            once: false,
            priority: 0,
            ...opts,
        });

        this._dirty = true;

        return this;
    }

    public hasListener(fn: ListenerCallback<A>) {
        return this._map.has(fn);
    }

    public all() {
        if (this._dirty) {
            this._dirty = false;
            sortMap(this._map, (a, b) => b[1].priority - a[1].priority);
        }

        return [...this._map.keys()];
    }

    public removeListeners() {
        this._map.clear();
        this._dirty = false;
        return this;
    }

    public removeListener(fn: ListenerCallback<A>) {
        this._map.delete(fn);

        return this;
    }

    public emit(...args: A): void {
        this.all().forEach((l) => this.apply(l, args));
    }

    public dispatch(...args: A) {
        return this
            .all()
            .reduce((p, l) => p.then(() => this.apply(l, args)), XPromise.resolve());
    }

    public hasListeners() {
        return this.size > 0;
    }

    protected apply(fn: ListenerCallback<A>, args: A) {
        return XPromise.wrap(() => {
            const opts = this._map.get(fn);

            if (!opts) {
                return;
            }

            if (opts.once) {
                this.removeListener(fn);
            }

            return fn(...args);
        }).catch((e) => this._options.onError(e, args, fn));
    }
}
