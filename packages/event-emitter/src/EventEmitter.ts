import {ListenerObj, ListenerOptions, ListenerSet} from "./ListenerSet";

export type EventEmitterEvents = Record<string, any[]>;

export type EventEmitterCallback<T extends EventEmitterEvents, K extends keyof T> = (...args: T[K]) => any;

export interface EventEmitterInit<T extends EventEmitterEvents> {
    onError: <K extends keyof T>(error: any, event: K, args: T[K], listener: ListenerObj<T[K]>) => void;
}

export class EventEmitter<T extends EventEmitterEvents = any> {
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
        map.get(event)!.add(listener, opts);
        return this;
    }

    public emit<K extends keyof T>(event: K, ...args: T[K]) {
        const listeners = this.map.get(event);
        if (!listeners) {
            return;
        }

        for (const obj of listeners.all()) {
            const {once, passive, callback} = obj;
            if (once) {
                listeners.delete(callback);
            }
            try {
                callback(event, ...args);
            } catch (e) {
                this.onError(e, event, args, obj);
                if (!passive) {
                    throw e;
                }
                // noinspection JSIgnoredPromiseFromCall
            }
        }
    }

    public once<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, {...opts, once: true});
    }

    public hasListener<K extends keyof T>(event: K, listener: EventEmitterCallback<T, K>) {
        const {map} = this;
        return map.has(event) && map.get(event)!.has(listener);
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
            set.delete(listener);
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
