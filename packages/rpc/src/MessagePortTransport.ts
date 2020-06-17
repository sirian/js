import {AbstractTransport} from "./AbstractTransport";
import {Payload} from "./Payload";

export interface IMessagePort {
    onmessage(ev: MessageEvent): any;

    postMessage(message: any): any;
}

export class MessagePortTransport extends AbstractTransport {
    protected port: MessagePort;

    constructor(port: MessagePort) {
        super();
        this.port = port;

        port.onmessage = (event) => this.dispatch(event.data);
    }

    public send(payload: Payload<any, any>) {
        this.port.postMessage(payload);
    }
}
