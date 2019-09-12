import {MessageEventAdapter} from "./MessageEventAdapter";

export class MessagePortAdapter extends MessageEventAdapter {
    public readonly port1: MessagePort;
    public readonly port2: MessagePort;

    constructor() {
        super("");
        const {port1, port2} = new MessageChannel();
        this.port1 = port1;
        this.port2 = port2;
        port1.addEventListener("message", this);
        port1.start();
    }

    public static supports() {
        return "function" === typeof MessageChannel;
    }

    public postMessage(data: any) {
        this.port2.postMessage(data);
    }
}
