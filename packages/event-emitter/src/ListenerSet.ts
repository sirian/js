export type ListenerCallback<A extends any[] = any> = (...args: A) => any;

export interface ListenerOptions {
    once?: boolean;
    priority?: number;
    passive?: boolean;
}

export interface ListenerObj<A extends any[]> extends Required<ListenerOptions> {
    callback: ListenerCallback<A>;
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

    public add(callback: ListenerCallback<A>, opts?: ListenerOptions) {
        const obj = this.map.get(callback) || ({} as any);

        Object.assign(obj, {
            once: false,
            priority: 0,
            passive: false,
            callback,
        }, opts);

        if (!this.map.get(callback)) {
            this.listeners.push(obj);
        }

        this.map.set(callback, obj);
        this.dirty = true;

        return this;
    }

    public get(listener: ListenerCallback<A>) {
        return this.map.get(listener);
    }

    public has(listener: ListenerCallback<A>) {
        return this.map.has(listener);
    }

    public all() {
        if (this.dirty) {
            this.sort();
        }

        return this.listeners.slice();
    }

    public clear() {
        this.map.clear();
        this.dirty = false;
        return this;
    }

    public delete(callback: ListenerCallback<A>) {
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

    public sort() {
        this.dirty = false;
        this.listeners.sort((a, b) => b.priority - a.priority);
    }
}
