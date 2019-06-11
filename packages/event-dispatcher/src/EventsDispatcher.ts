import {Arr, Var, XMap} from "@sirian/common";
import {Disposer} from "@sirian/disposer";
import {XPromise} from "@sirian/xpromise";
import {Event} from "./Event";
import {EventDispatcher} from "./EventDispatcher";
import {TEventListener} from "./EventListener";

export class EventsDispatcher<T extends Record<string, Event> = Record<string, Event>> {
    protected dispatchers: XMap<keyof T, EventDispatcher>;

    constructor() {
        this.dispatchers = new XMap(() => new EventDispatcher());
    }

    public dispatchSync<K extends keyof T>(eventName: K | K[], event: T[K]) {
        for (const name of Arr.cast(eventName)) {
            const dispatcher = this.getDispatcher(name);

            if (dispatcher) {
                dispatcher.dispatchSync(event);
            }
        }
        return event;
    }

    public dispatch<K extends keyof T>(eventName: K | K[], event: T[K]) {
        const names = Arr.cast(eventName);

        let result: XPromise<T[K]> = XPromise.resolve();

        for (const name of names) {
            const dispatcher = this.getDispatcher(name);

            if (dispatcher) {
                result = result.then(() => dispatcher.dispatch(event));
            }
        }

        return result;
    }

    public getListeners<K extends keyof T>(eventName: K) {
        const dispatcher = this.getDispatcher(eventName);

        if (!dispatcher) {
            return [];
        }

        return dispatcher.getListeners();
    }

    public hasListeners(eventName: string) {
        return this.dispatchers.has(eventName);
    }

    public addListener<K extends keyof T>(eventName: K | K[], listener: TEventListener<T[K]>) {
        for (const name of Arr.cast(eventName)) {
            const dispatcher = this.dispatchers.ensure(name) as EventDispatcher<T[K]>;
            const eventListener = dispatcher.addListener(listener);
            Disposer.addCallback(eventListener, () => this.removeListener(name, listener));
        }

        return this;
    }

    public once<K extends keyof T>(eventName: K | K[], listener: TEventListener<T[K]>) {
        if (Var.isFunction(listener)) {
            listener = {
                callback: listener,
            };
        }
        listener.limit = 1;

        this.addListener(eventName, listener);

        return this;
    }

    public removeListener<K extends keyof T>(eventName: K, listener: TEventListener<T[K]>) {
        const dispatcher = this.getDispatcher(eventName)!;

        if (!dispatcher) {
            return this;
        }

        dispatcher.removeListener(listener);

        if (!dispatcher.hasListeners()) {
            this.dispatchers.delete(eventName);
        }

        return this;
    }

    protected getDispatcher<K extends keyof T>(key: K): EventDispatcher<T[K]> | undefined {
        return this.dispatchers.get(key);
    }
}
