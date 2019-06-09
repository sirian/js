import {Event} from "./Event";
import {EventDispatcher} from "./EventDispatcher";

export class SimpleEventDispatcher extends EventDispatcher<Event> {
    public dispatchSync(event?: Event) {
        return super.dispatchSync(event || new Event());
    }

    public dispatch(event?: Event) {
        return super.dispatch(event || new Event());
    }
}
