import {AbstractTransport} from "./AbstractTransport";
import {Payload} from "./Payload";

export interface IMessageEvent {
    data: any;
}

export interface IMessagePort {
    onmessage(ev: IMessageEvent): any;

    postMessage(message: any): any;
}

export class MessagePortTransport extends AbstractTransport {
    protected port: IMessagePort;

    constructor(port: IMessagePort) {
        super();
        this.port = port;

        port.onmessage = (event) => this.dispatch(event.data);
    }

    public send(payload: Payload<any, any>) {
        this.port.postMessage(payload);
    }
}
