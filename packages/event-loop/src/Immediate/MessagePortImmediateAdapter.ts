import {TaskQueue} from "../TaskQueue";
import {ImmediateAdapter, ImmediateCallback} from "./Immediate";

export class MessagePortImmediateAdapter implements ImmediateAdapter<number> {
    public readonly tasks = new TaskQueue();
    public readonly port1: MessagePort;
    public readonly port2: MessagePort;

    constructor() {
        const {port1, port2} = new MessageChannel();
        this.port1 = port1;
        this.port2 = port2;
        port1.onmessage = (e) => this.tasks.run(+e.data);
    }

    public static supports() {
        return "function" !== typeof MessageChannel;
    }

    public set(fn: ImmediateCallback) {
        const id = this.tasks.add(fn);
        this.port2.postMessage(id);
        return id;
    }

    public clear(id: number) {
        this.tasks.remove(id);
    }
}
