import {XMap} from "@sirian/common";
import {ListenerObj, ListenerOptions} from "@sirian/event-emitter";
import {ExactTypedKeyOf} from "@sirian/ts-extra-types";
import {XPromise} from "@sirian/xpromise";
import {Event} from "./Event";
import {EventDispatcher, EventDispatcherListener} from "./EventDispatcher";

export type EventsDispatcherEventMap = Record<string, Event>;

export class EventsDispatcher<T extends EventsDispatcherEventMap = Record<string, Event>> {
    protected map: XMap<keyof T, EventDispatcher>;

    constructor() {
        this.map = new XMap(() => new EventDispatcher());
    }

    public dispatchSync<K extends keyof T>(eventName: K, event: T[K]) {
        const dispatcher = this.getDispatcher(eventName);

        if (dispatcher) {
            dispatcher.dispatchSync(event);
        }

        return event;
    }

    public dispatch<K extends ExactTypedKeyOf<T, Event>>(eventName: K): XPromise<Event>;
    public dispatch<K extends keyof T>(eventName: K, event: T[K]): XPromise<T[K]>;
    public dispatch(eventName: string, event?: any) {
        const dispatcher = this.getDispatcher(eventName);
        const ev = event || new Event();
        return dispatcher ? dispatcher.dispatch(ev) : XPromise.resolve(ev);
    }

    public getListeners<K extends keyof T>(eventName: K): Array<ListenerObj<[T[K]]>> {
        const dispatcher = this.getDispatcher(eventName);

        return dispatcher ? dispatcher.all() : [];
    }

    public hasListeners(eventName: string) {
        return this.map.has(eventName);
    }

    public addListener<K extends keyof T>(eventName: K, listener: EventDispatcherListener<T[K]>, opts?: ListenerOptions) {
        const dispatcher = this.map.ensure(eventName) as EventDispatcher<T[K]>;
        dispatcher.addListener(listener, opts);
        return this;
    }

    public once<K extends keyof T>(eventName: K, listener: EventDispatcherListener<T[K]>, opts?: ListenerOptions) {
        this.addListener(eventName, listener, {...opts, limit: 1});
        return this;
    }

    public removeListener<K extends keyof T>(eventName: K, listener: EventDispatcherListener<T[K]>) {
        const dispatcher = this.getDispatcher(eventName)!;

        if (dispatcher) {
            dispatcher.removeListener(listener);

            if (!dispatcher.hasListeners()) {
                this.map.delete(eventName);
            }
        }

        return this;
    }

    protected getDispatcher<K extends keyof T>(key: K): EventDispatcher<T[K]> | undefined {
        return this.map.get(key);
    }
}
