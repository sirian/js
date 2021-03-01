import {ListenerObj, ListenerOptions, ListenerSet} from "./ListenerSet";

export type EventEmitterEventMap = Record<string, any[]>;

export type EventEmitterCallback<T extends EventEmitterEventMap, K extends keyof T> = (...args: T[K]) => any;

export interface EventEmitterInit<T extends EventEmitterEventMap> {
    onError: <K extends keyof T>(error: any, event: K, args: T[K], listener: ListenerObj<T[K]>) => void;
}

export class EventEmitter<T extends EventEmitterEventMap = any> {

    private readonly _listeners: Map<keyof T, ListenerSet>;
    private readonly _onError: EventEmitterInit<T>["onError"];

    constructor(init: Partial<EventEmitterInit<T>> = {}) {
        this._listeners = new Map();
        this._onError = init.onError || ((e) => Promise.reject(e));
    }

    public on<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, opts);
    }

    public addListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        const listeners = this._listeners;
        if (!listeners.has(event)) {
            listeners.set(event, new ListenerSet());
        }
        listeners.get(event)!.addListener(listener, opts);
        return this;
    }

    public getListeners<K extends keyof T>(event: K) {
        const set = this._listeners.get(event) as ListenerSet<T[K]> | undefined;
        return set ? set.all() : [];
    }

    public emit<K extends keyof T>(event: K, ...args: T[K]) {
        const set = this._listeners.get(event) as ListenerSet<T[K]> | undefined;

        if (!set) {
            return;
        }

        for (const obj of set) {
            try {
                set.applyListener(obj.callback, [...args] as T[K]);
            } catch (e) {
                this._onError(e, event, [...args] as T[K], obj);
                if (!obj.passive) {
                    throw e;
                }
            }
        }
    }

    public once<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, {...opts, limit: 1});
    }

    public hasListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        return this._listeners.has(event) && this._listeners.get(event)!.hasListener(listener);
    }

    public hasListeners(event?: keyof T): boolean;
    public hasListeners(...args: any[]) {
        return args.length ? this._listeners.has(args[0]) : this._listeners.size > 0;
    }

    public off<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        return this.removeListener(event, listener);
    }

    public removeListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        const set = this._listeners.get(event);
        if (set) {
            set.removeListener(listener);
            if (!set.size) {
                this._listeners.delete(event);
            }
        }
        return this;
    }

    public removeAllListeners() {
        this._listeners.clear();
        return this;
    }
}
