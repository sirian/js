export type ListenerCallback<A extends any[] = any> = (...args: A) => any;

export interface ListenerOptions {
    priority?: number;
    passive?: boolean;
    limit?: number;
}

export interface ListenerObj<A extends any[]> extends Required<ListenerOptions> {
    callback: ListenerCallback<A>;
    times: number;
}

export class ListenerSet<A extends any[] = any> {

    private readonly _map: Map<any, ListenerObj<A>>;
    private readonly _listeners: Array<ListenerObj<A>>;
    private _dirty: boolean;

    constructor() {
        this._map = new Map();
        this._dirty = false;
        this._listeners = [];
    }

    public get size() {
        return this._map.size;
    }

    public once(callback: ListenerCallback<A>, opts?: ListenerOptions) {
        return this.addListener(callback, {...opts, limit: 1});
    }

    public addListener(callback: ListenerCallback<A>, opts?: ListenerOptions) {
        const obj = this._map.get(callback) ?? ({} as any);

        Object.assign(obj, {
            priority: 0,
            passive: false,
            limit: 0,
            ...opts,
            times: 0,
            callback,
        });

        if (!this._map.get(callback)) {
            this._listeners.push(obj);
        }

        this._map.set(callback, obj);
        this._dirty = true;

        return this;
    }

    public getListener(listener: ListenerCallback<A>) {
        return this._map.get(listener);
    }

    public hasListener(listener: ListenerCallback<A>) {
        return this._map.has(listener);
    }

    public all() {
        if (this._dirty) {
            this._dirty = false;
            this._listeners.sort((a, b) => b.priority - a.priority);
        }

        return this._listeners.slice();
    }

    public removeListeners() {
        this._map.clear();
        this._dirty = false;
        return this;
    }

    public removeListener(callback: ListenerCallback<A>) {
        if (this._map.has(callback)) {
            const index = this._listeners.findIndex((obj) => obj.callback === callback);
            this._listeners.splice(index, 1);
            this._map.delete(callback);
        }

        return this;
    }

    public* [Symbol.iterator]() {
        yield* this.all();
    }

    public applyListener(callback: ListenerCallback<A>, args: A) {
        const obj = this.getListener(callback);

        if (!obj) {
            return;
        }

        const limit = obj.limit;

        if (limit) {
            if (obj.times < limit) {
                obj.times++;
            }

            if (obj.times >= limit) {
                this.removeListener(obj.callback);
            }
            if (obj.times > limit) {
                return;
            }
        }

        return callback(...args);
    }

    public hasListeners() {
        return this.size > 0;
    }
}
