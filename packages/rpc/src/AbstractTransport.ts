import {EventDispatcher} from "@sirian/event-dispatcher";
import {Payload} from "./Payload";
import {TransportEvent} from "./TransportEvent";

export abstract class AbstractTransport {
    public readonly onMessage = new EventDispatcher<TransportEvent<any, any>>();

    public abstract send(payload: Payload<any, any>): any;

    public dispatch(payload: Payload<any, any>) {
        const e = new TransportEvent(this, payload);
        return this.onMessage.dispatch(e);
    }
}
