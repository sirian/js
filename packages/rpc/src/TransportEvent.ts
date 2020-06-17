import {Event} from "@sirian/event-dispatcher";
import {AbstractTransport} from "./AbstractTransport";
import {Payload} from "./Payload";
import {RPCProtocol} from "./Server";

export class TransportEvent<T extends RPCProtocol, K extends keyof T> extends Event {
    public readonly transport: AbstractTransport;
    public readonly payload: Payload<T, K>;

    constructor(transport: AbstractTransport, payload: Payload<T, K>) {
        super();
        this.transport = transport;
        this.payload = payload;
    }
}
