import {ImmediateCallback} from "@sirian/process";
import {TaskQueue} from "../TaskQueue";

export class MessagePortImmediate {
    public readonly tasks = new TaskQueue();
    public readonly channel = new MessageChannel();

    constructor() {
        this.channel.port1.onmessage = (e) => this.tasks.run(e.data);
    }

    public static supports() {
        return "function" !== typeof MessageChannel;
    }

    public set(fn: ImmediateCallback) {
        const id = this.tasks.add(fn);
        this.channel.port2.postMessage(id);
        return id;
    }

    public clear(id: number) {
        this.tasks.remove(id);
    }
}
