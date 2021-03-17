import {BaseEvent} from "./BaseEvent";
import {EventDispatcher} from "./EventDispatcher";
import {MultiDispatcher} from "./MultiDispatcher";

export type EventsDispatcherEventMap = Record<string, BaseEvent>;

export class EventsDispatcher<T extends EventsDispatcherEventMap> extends MultiDispatcher<{ [P in keyof T]: [T[P]] }> {
    constructor() {
        super();
    }

    public emit<K extends keyof T>(eventName: K, event: T[K]) {
        super.emit(eventName, event);
        return event;
    }

    public dispatch<K extends keyof T>(eventName: K, event: T[K]) {
        return super.dispatch(eventName, event).then(() => event);
    }

    protected _createDispatcher<K extends keyof T>(event: K) {
        return new EventDispatcher<T[K]>();
    }
}
