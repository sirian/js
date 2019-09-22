import {ListenerObj, ListenerOptions, ListenerSet} from "./ListenerSet";

export type EventEmitterEventMap = Record<string, any[]>;

export type EventEmitterCallback<T extends EventEmitterEventMap, K extends keyof T> = (...args: T[K]) => any;

export interface EventEmitterInit<T extends EventEmitterEventMap> {
    onError: <K extends keyof T>(error: any, event: K, args: T[K], listener: ListenerObj<T[K]>) => void;
}

export class EventEmitter<T extends EventEmitterEventMap = any> {
    protected listeners: Map<keyof T, ListenerSet>;
    protected onError: EventEmitterInit<T>["onError"];

    constructor(init: Partial<EventEmitterInit<T>> = {}) {
        this.listeners = new Map();
        this.onError = init.onError || ((e) => Promise.reject(e));
    }

    public on<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, opts);
    }

    public addListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        const {listeners} = this;
        if (!listeners.has(event)) {
            listeners.set(event, new ListenerSet());
        }
        listeners.get(event)!.addListener(listener, opts);
        return this;
    }

    public getListeners<K extends keyof T>(event: K) {
        const set = this.listeners.get(event) as ListenerSet<T[K]> | undefined;
        return set ? set.all() : [];
    }

    public emit<K extends keyof T>(event: K, ...args: T[K]) {
        const set = this.listeners.get(event) as ListenerSet<T[K]> | undefined;

        if (!set) {
            return;
        }

        for (const obj of set.all()) {
            const {passive, callback} = obj;

            try {
                set.applyListener(callback, [...args] as T[K]);
            } catch (e) {
                this.onError(e, event, [...args] as T[K], obj);
                if (!passive) {
                    throw e;
                }
            }
        }
    }

    public once<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, {...opts, limit: 1});
    }

    public hasListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        const {listeners} = this;
        return listeners.has(event) && listeners.get(event)!.hasListener(listener);
    }

    public hasListeners(event?: keyof T): boolean;
    public hasListeners(...args: any[]) {
        return args.length ? this.listeners.has(args[0]) : this.listeners.size > 0;
    }

    public off<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        return this.removeListener(event, listener);
    }

    public removeListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        const set = this.listeners.get(event);
        if (set) {
            set.removeListener(listener);
            if (!set.size) {
                this.listeners.delete(event);
            }
        }
        return this;
    }

    public removeAllListeners() {
        this.listeners.clear();
        return this;
    }
}
