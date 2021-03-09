import {XPromise} from "@sirian/xpromise";
import {BaseEvent} from "./BaseEvent";
import {Dispatcher, ListenerCallback} from "./Dispatcher";

export class EventDispatcher<E extends BaseEvent> extends Dispatcher<[E]> {
    protected apply(callback: ListenerCallback<[E]>, args: [E]) {
        return XPromise.wrap(() => args[0].isPropagationStopped() ? void 0 : super.apply(callback, args));
    }
}
