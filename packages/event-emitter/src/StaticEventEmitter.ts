import {EventEmitter, EventEmitterCallback, EventEmitterEventMap} from "./EventEmitter";
import {ListenerOptions} from "./ListenerSet";

interface IEmitterAware<T extends EventEmitterEventMap> {
    emitter: EventEmitter<T>;
}

export class StaticEventEmitter {
    public static on<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.emitter.on(event, listener, opts);
        return this;
    }

    public static addListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.emitter.addListener(event, listener, opts);
        return this;
    }

    public static getListeners<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K) {
        return this.emitter.getListeners(event);
    }

    public static emit<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, ...args: T[K]) {
        this.emitter.emit(event, ...args);
        return this;
    }

    public static once<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>, opts?: ListenerOptions) {
        this.emitter.once(event, listener, opts);
        return this;
    }

    public static hasListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        return this.emitter.hasListener(event, listener);
    }

    public static hasListeners<T extends EventEmitterEventMap>(this: IEmitterAware<T>, event?: keyof T): boolean;

    public static hasListeners(this: IEmitterAware<any>, ...args: any[]) {
        return this.emitter.hasListeners(...args);
    }

    public static off<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        this.emitter.off(event, listener);
        return this;
    }

    public static removeListener<T extends EventEmitterEventMap, K extends keyof T>(this: IEmitterAware<T>, event: K, listener: EventEmitterCallback<T, K>) {
        this.emitter.removeListener(event, listener);
        return this;
    }

    public static removeAllListeners(this: IEmitterAware<any>) {
        this.emitter.removeAllListeners();
        return this;
    }
}
