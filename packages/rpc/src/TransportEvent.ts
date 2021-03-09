import {BaseEvent} from "@sirian/event-dispatcher";
import {Payload, ResponsePayload} from "./Payload";
import {RPCProtocol} from "./Server";

export class TransportEvent<T extends RPCProtocol, K extends keyof T> extends BaseEvent {
    public readonly payload: Payload<T, K>;
    public readonly reply: (response: ResponsePayload<T, K>) => any;

    constructor(payload: Payload<T, K>, reply: (response: ResponsePayload<T, K>) => any) {
        super();
        this.payload = payload;
        this.reply = reply;
    }
}
