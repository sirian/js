import {ListenerObj, ListenerOptions, ListenerSet} from "./ListenerSet";

export type EventEmitterEventMap = Record<string, any[]>;

export type EventEmitterCallback<T extends EventEmitterEventMap, K extends keyof T> = (...args: T[K]) => any;

export interface EventEmitterInit<T extends EventEmitterEventMap> {
    onError: <K extends keyof T>(error: any, event: K, args: T[K], listener: ListenerObj<T[K]>) => void;
}

export class EventEmitter<T extends EventEmitterEventMap = any> {
    protected map: Map<keyof T, ListenerSet>;
    protected onError: EventEmitterInit<T>["onError"];

    constructor(init: Partial<EventEmitterInit<T>> = {}) {
        this.map = new Map();
        this.onError = init.onError || ((e) => Promise.reject(e));
    }

    public on<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, opts);
    }

    public addListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        const {map} = this;
        if (!map.has(event)) {
            map.set(event, new ListenerSet());
        }
        map.get(event)!.addListener(listener, opts);
        return this;
    }

    public getListeners<K extends keyof T>(event: K) {
        const listeners = this.map.get(event) as ListenerSet<T[K]> | undefined;
        return listeners ? listeners.all() : [];
    }

    public emit<K extends keyof T>(event: K, ...args: T[K]) {
        const listeners = this.map.get(event) as ListenerSet<T[K]> | undefined;

        if (!listeners) {
            return;
        }

        for (const obj of listeners.all()) {
            const {passive, callback} = obj;

            try {
                listeners.applyListener(callback, [...args] as T[K]);
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
        const {map} = this;
        return map.has(event) && map.get(event)!.hasListener(listener);
    }

    public hasListeners(event?: keyof T): boolean;
    public hasListeners(...args: any[]) {
        return args.length ? this.map.has(args[0]) : this.map.size > 0;
    }

    public off<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        return this.removeListener(event, listener);
    }

    public removeListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        const set = this.map.get(event);
        if (set) {
            set.removeListener(listener);
            if (!set.size) {
                this.map.delete(event);
            }
        }
        return this;
    }

    public removeAllListeners() {
        this.map.clear();
        return this;
    }
}