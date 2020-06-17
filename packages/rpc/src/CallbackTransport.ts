import {AbstractTransport} from "./AbstractTransport";

export class CallbackTransport extends AbstractTransport {
    public readonly send: AbstractTransport["send"];

    constructor(fn: AbstractTransport["send"]) {
        super();
        this.send = fn;
    }
}
