import {XPromise} from "@sirian/xpromise";
import {Event} from "./Event";
import {EventListener} from "./EventListener";

interface DispatchQueueInit<E extends Event> {
    event: E;
    listeners: Iterable<EventListener<E>>;
    async: boolean;
}

export class DispatchQueue<E extends Event> {
    protected event: E;
    protected iterator: Iterator<EventListener<E>>;
    protected async: boolean;

    constructor(init: DispatchQueueInit<E>) {
        this.event = init.event;
        this.iterator = init.listeners[Symbol.iterator]();
        this.async = init.async;
    }

    public static dispatch<E extends Event>(init: DispatchQueueInit<E>): XPromise<E> {
        const queue = new DispatchQueue(init);
        return queue.dispatch();
    }

    public dispatch(): XPromise<E> {
        return XPromise
            .wrap(() => this.dispatchNext())
            .then(() => this.event);
    }

    protected dispatchNext(): void | XPromise<void> {
        const event = this.event;

        if (event.isPropagationStopped()) {
            return;
        }

        const {done, value} = this.iterator.next();

        if (done) {
            return;
        }

        const result = this.applyListener(value, event);

        if (this.async) {
            return XPromise
                .resolve(result)
                .then(() => this.dispatchNext());
        }

        this.dispatchNext();
    }

    protected applyListener(listener: EventListener<E>, event: E) {
        const passive = listener.passive;
        try {
            const result = listener.handleEvent(event);
            if (!passive) {
                return result;
            }
        } catch (e) {
            if (!passive) {
                throw e;
            }
        }
    }
}
