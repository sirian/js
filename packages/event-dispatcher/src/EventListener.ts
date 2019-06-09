import {Disposer} from "@sirian/disposer";
import {Ctor} from "@sirian/ts-extra-types";
import {Event} from "./Event";

export type EventListenerFn<E extends Event = any> = <EV extends E>(event: EV) => any;

export interface EventListenerObj<E extends Event> {
    filter?: Array<Ctor<E>>;
    limit?: number;
    priority?: number;
    callback: EventListenerFn<E>;
    passive?: boolean;
}

export type TEventListener<E extends Event> = EventListenerFn<E> | EventListenerObj<E>;

export class EventListener<E extends Event> {
    public readonly priority: number;
    public readonly passive: boolean;
    public readonly callback: EventListenerFn<E>;
    public readonly limit?: number;
    protected readonly filter?: Set<Ctor<E>>;
    protected times: number = 0;

    constructor(o: EventListenerObj<E>) {
        const init = {
            priority: 0,
            passive: false,
            ...o,
        };
        this.limit = init.limit;
        this.priority = init.priority;
        this.passive = init.passive;
        this.callback = init.callback;

        if (o.filter) {
            this.filter = new Set(o.filter);
        }

        Disposer.for(this.callback).addChild(this);
    }

    public handleEvent<EV extends E>(event: E) {
        if (this.filter && !this.filter.has(event.constructor as Ctor<E>)) {
            return;
        }

        if (this.isLimitReached() || Disposer.isDisposed(this)) {
            return;
        }

        this.times++;

        if (this.isLimitReached()) {
            Disposer.dispose(this);
        }

        return this.callback(event);
    }

    public isLimitReached() {
        return this.limit && this.times >= this.limit;
    }
}
