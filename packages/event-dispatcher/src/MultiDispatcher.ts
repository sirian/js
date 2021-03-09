import {throwError, XMap} from "@sirian/common";
import {XPromise} from "@sirian/xpromise";
import {Dispatcher, ListenerCallback, ListenerOptions} from "./Dispatcher";

export type MultiDispatcherEventMap = Record<string, any[]>;

export type MultiDispatcherCallback<T extends MultiDispatcherEventMap, K extends keyof T> = (...args: T[K]) => any;

export interface MultiDispatcherOptions<T extends MultiDispatcherEventMap> {
    onError: <K extends keyof T>(error: any, event: K, args: T[K], listener: ListenerCallback<T[K]>) => void;
}

export class MultiDispatcher<T extends MultiDispatcherEventMap = any> {
    protected readonly options: MultiDispatcherOptions<T>;
    private readonly _map: XMap<keyof T, Dispatcher>;

    constructor(options: Partial<MultiDispatcherOptions<T>> = {}) {
        this.options = {
            onError: (e) => throwError(e),
            ...options,
        };

        this._map = new XMap();
    }

    public on<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, opts);
    }

    public once<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>, opts?: ListenerOptions) {
        return this.addListener(event, listener, {...opts, once: true});
    }

    public addListener<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>, opts?: ListenerOptions) {
        const dispatcher = this._map.ensure(event, () => this.createDispatcher(event));

        dispatcher.addListener(listener, opts);
        return this;
    }

    public getListeners<K extends keyof T>(event: K) {
        return this._get(event)?.all() ?? [];
    }

    public emit<K extends keyof T>(event: K, ...args: T[K]) {
        try {
            this._get(event)?.emit(...args);
        } finally {
            this._cleanup(event);
        }
    }

    public dispatch<K extends keyof T>(eventName: K, ...args: T[K]) {
        return XPromise
            .resolve()
            .then(() => this._get(eventName)?.dispatch(...args))
            .finally(() => this._cleanup(eventName));
    }

    public hasListener<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>) {
        return this._get(event)?.hasListener(listener) ?? false;
    }

    public hasListeners(event: keyof T): boolean {
        return this._map.has(event);
    }

    public size() {
        return [...this._map.values()].reduce((prev, set) => prev + set.size, 0);
    }

    public off<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>) {
        return this.removeListener(event, listener);
    }

    public removeListener<K extends keyof T>(event: K, listener: MultiDispatcherCallback<T, K>) {
        this._get(event)?.removeListener(listener);
        this._cleanup(event);

        return this;
    }

    public removeAllListeners() {
        this._map.clear();
        return this;
    }

    protected createDispatcher<K extends keyof T>(event: K): Dispatcher<T[K]> {
        return new Dispatcher<T[K]>({
            onError: (error, fn, args) => this.options.onError?.(event, error, fn, args),
        });
    }

    private _get<K extends keyof T>(event: K) {
        return this._map.get(event) as Dispatcher<T[K]>;
    }

    private _cleanup(eventName: keyof T) {
        const dispatcher = this._get(eventName);
        if (!dispatcher?.hasListeners()) {
            this._map.delete(eventName);
        }
    }
}
