import {EventEmitter, EventEmitterCallback, EventEmitterEventMap} from "./EventEmitter";
import {ListenerOptions} from "./ListenerSet";

interface IEmitterAware<T extends EventEmitterEventMap> {
    getEmitter(): EventEmitter<T>;
}

export class StaticEventEmitter {
    protected static emitter?: EventEmitter;

    public static getEmitter() {
        return this.emitter = this.emitter || new EventEmitter();
    }

    public static on<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.getEmitter().on(event, listener, opts);
        return this;
    }

    public static addListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.getEmitter().addListener(event, listener, opts);
        return this;
    }

    public static getListeners<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K) {
        return this.getEmitter().getListeners(event);
    }

    public static emit<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, ...args: T[K]) {
        this.getEmitter().emit(event, ...args);
        return this;
    }

    public static once<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.getEmitter().once(event, listener, opts);
        return this;
    }

    public static hasListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        return this.getEmitter().hasListener(event, listener);
    }

    public static hasListeners<T extends EventEmitterEventMap>(this: IEmitterAware<T>, event?: keyof T): boolean;

    public static hasListeners(this: IEmitterAware<any>, ...args: any[]) {
        return this.getEmitter().hasListeners(...args);
    }

    public static off<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        this.getEmitter().off(event, listener);
        return this;
    }

    public static removeListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        this.getEmitter().removeListener(event, listener);
        return this;
    }

    public static removeAllListeners(this: IEmitterAware<any>) {
        this.getEmitter().removeAllListeners();
        return this;
    }
}
