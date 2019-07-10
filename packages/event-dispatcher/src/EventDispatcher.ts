import {XPromise} from "@sirian/xpromise";
import {DispatchError} from "./DispatchError";
import {DispatchQueue} from "./DispatchQueue";
import {Event} from "./Event";
import {Listenable} from "./Listenable";

export class EventDispatcher<E extends Event = any> extends Listenable<E> {
    public dispatchSync(event: E) {
        const promise = this.doDispatch(event, false);

        if (promise.isPending()) {
            throw new DispatchError("Internal error - dispatchSync() returned pending XPromise");
        }

        if (promise.isRejected()) {
            throw promise.getValue();
        }

        return event;
    }

    public dispatch(event: E): XPromise<E> {
        return this.doDispatch(event, true);
    }

    protected doDispatch(event: E, async: boolean) {
        return DispatchQueue.dispatch({
            async,
            event,
            listeners: this.listeners,
        });
    }
}
