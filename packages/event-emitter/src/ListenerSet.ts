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
    protected readonly map: Map<any, ListenerObj<A>>;
    protected listeners: Array<ListenerObj<A>>;
    protected dirty: boolean;

    constructor() {
        this.map = new Map();
        this.dirty = false;
        this.listeners = [];
    }

    public get size() {
        return this.map.size;
    }

    public once(callback: ListenerCallback<A>, opts?: ListenerOptions) {
        return this.addListener(callback, {...opts, limit: 1});
    }

    public addListener(callback: ListenerCallback<A>, opts?: ListenerOptions) {
        const obj = this.map.get(callback) || ({} as any);

        Object.assign(obj, {
            priority: 0,
            passive: false,
            times: 0,
            limit: 0,
            callback,
        }, opts);

        if (!this.map.get(callback)) {
            this.listeners.push(obj);
        }

        this.map.set(callback, obj);
        this.dirty = true;

        return this;
    }

    public getListener(listener: ListenerCallback<A>) {
        return this.map.get(listener);
    }

    public hasListener(listener: ListenerCallback<A>) {
        return this.map.has(listener);
    }

    public all() {
        if (this.dirty) {
            this.dirty = false;
            this.listeners.sort((a, b) => b.priority - a.priority);
        }

        return this.listeners.slice();
    }

    public removeListeners() {
        this.map.clear();
        this.dirty = false;
        return this;
    }

    public removeListener(callback: ListenerCallback<A>) {
        if (this.map.has(callback)) {
            const index = this.listeners.findIndex((obj) => obj.callback === callback);
            this.listeners.splice(index, 1);
            this.map.delete(callback);
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

        const {limit} = obj;

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
