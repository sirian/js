import {Var} from "@sirian/common";
import {ListenerCallback, ListenerObj, ListenerSet} from "@sirian/event-emitter";
import {XPromise} from "@sirian/xpromise";
import {Event} from "./Event";

export type EventDispatcherListener<E extends Event> = ListenerCallback<[E]>;

export class EventDispatcher<E extends Event = any> extends ListenerSet<[E]> {
    public dispatchSync(event: E) {
        for (const obj of this.all()) {
            this.doDispatch(obj, event);
        }
        return event;
    }

    public dispatch(event: E) {
        return new XPromise<E>(async (resolve, reject) => {
            const listeners = this.all();
            try {
                for (const obj of listeners) {
                    const result = this.doDispatch(obj, event);
                    if (!obj.passive && Var.isPromiseLike(result)) {
                        await result;
                    }
                }
                resolve(event);
            } catch (e) {
                reject(e);
            }
        });
    }

    protected doDispatch(obj: ListenerObj<[E]>, event: E) {
        if (event.isPropagationStopped()) {
            return;
        }

        if (!obj.passive) {
            return this.applyListener(obj.callback, [event]);
        }

        return XPromise.wrap(() => this.applyListener(obj.callback, [event]));
    }

}
