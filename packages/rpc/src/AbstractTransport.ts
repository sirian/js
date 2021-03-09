import {EventDispatcher} from "@sirian/event-dispatcher";
import {Payload, ResponsePayload} from "./Payload";
import {TransportEvent} from "./TransportEvent";

export abstract class AbstractTransport {
    public readonly onMessage = new EventDispatcher<TransportEvent<any, any>>();

    public abstract send(payload: Payload<any, any>): void;

    public dispatch(payload: Payload<any, any>, reply?: (response: ResponsePayload<any, any>) => any) {
        return this.onMessage.dispatch(new TransportEvent(payload, reply ?? ((r) => this.send(r))));
    }
}
