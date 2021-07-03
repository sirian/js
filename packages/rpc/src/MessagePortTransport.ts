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

        // eslint-disable-next-line unicorn/prefer-add-event-listener
        port.onmessage = (event) => this.dispatch(event.data);
    }

    public send(payload: Payload<any, any>) {
        // eslint-disable-next-line unicorn/require-post-message-target-origin
        this.port.postMessage(payload);
    }
}
