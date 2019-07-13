import {Arr, Var} from "@sirian/common";
import {Disposer} from "@sirian/disposer";
import {Ctor, Instance} from "@sirian/ts-extra-types";
import {Event} from "./Event";
import {EventListener, EventListenerFn, EventListenerObj, TEventListener} from "./EventListener";

export type EventListenerObjInit = [TEventListener<any>] | [Ctor, EventListenerFn] | [Ctor[], EventListenerFn];

export class Listenable<E extends Event> {
    protected readonly listeners: Array<EventListener<E>>;

    constructor() {
        this.listeners = [];
    }

    public addListener<EV extends E>(listener: TEventListener<EV>): this;
    public addListener<EV extends E, C extends Ctor<EV>>(filter: C | C[], fn: EventListenerFn<Instance<C>>): this;

    public addListener(...args: EventListenerObjInit) {
        const init = this.resolveArgs(...args);
        const listener = new EventListener<E>(init);

        const listeners = this.listeners;

        for (let i = listeners.length - 1; i >= 0; i--) {
            const item = listeners[i];
            if (item.priority >= listener.priority) {
                listeners.splice(i + 1, 0, listener);
                return this;
            }
        }

        listeners.unshift(listener);

        Disposer.for(listener).addCallback(() => this.removeListener(listener));

        return listener;
    }

    public once<EV extends E>(listener: TEventListener<EV>): this;
    public once<EV extends E, C extends Ctor<EV>>(filter: C | C[], fn: EventListenerFn<Instance<C>>): this;

    public once(...args: EventListenerObjInit) {
        const init = this.resolveArgs(...args);
        init.limit = 1;
        return this.addListener(init);
    }

    public hasListener<EV extends E>(listener: EventListener<EV> | TEventListener<EV>) {
        if (Var.isInstanceOf(listener, EventListener)) {
            this.listeners.some((value) => value === listener);
        }
        return this.listeners.some((value) => value.callback === listener);
    }

    public getListeners() {
        return [...this.listeners];
    }

    public hasListeners() {
        return this.listeners.length > 0;
    }

    public removeListeners() {
        this.listeners.length = 0;
        return this;
    }

    public removeListener<EV extends E>(listener: EventListener<EV> | TEventListener<EV>) {
        if (Var.isInstanceOf(listener, EventListener)) {
            Arr.removeItem(this.listeners, listener);
        } else {
            Arr.remove(this.listeners, (value) => value.callback === listener);
        }
        return this;
    }

    protected resolveArgs(...args: EventListenerObjInit): EventListenerObj<any> {
        switch (args.length) {
            case 2:
                return {
                    filter: Arr.cast(args[0]),
                    callback: args[1],
                };
            case 1:
                const a1 = args[0];
                if (Var.isFunction(a1)) {
                    return {callback: a1};
                }
                if (Var.isObject(a1)) {
                    return a1;
                }
        }
        throw new Error(`Bad args ${args}`);
    }
}
