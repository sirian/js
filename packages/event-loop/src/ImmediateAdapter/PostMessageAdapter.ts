import {MessageEventAdapter} from "./MessageEventAdapter";

export class PostMessageAdapter extends MessageEventAdapter {
    constructor() {
        super(Math.random());
        addEventListener("message", this, {capture: true});
    }

    public static supports() {
        return "function" === typeof postMessage && "function" === typeof addEventListener;
    }

    public postMessage(data: any) {
        postMessage(data, "*");
    }
}
