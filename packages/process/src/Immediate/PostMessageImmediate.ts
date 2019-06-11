import {ImmediateCallback} from "@sirian/process";
import {TaskQueue} from "../TaskQueue";

export class PostMessageImmediate {
    public readonly tasks = new TaskQueue();
    public readonly prefix: string;

    constructor(prefix?: string) {
        window.addEventListener("message", (e: MessageEvent) => this.handleEvent(e), {passive: true, capture: false});
        this.prefix = prefix || Math.random().toString().slice(2);
    }

    public static supports() {
        return "object" === typeof window
            && "function" === typeof window.addEventListener
            && "function" === typeof window.postMessage;
    }

    public set(fn: ImmediateCallback) {
        const id = this.tasks.add(fn);
        window.postMessage(this.prefix + id, "*");
        return id;
    }

    public clear(id: number) {
        this.tasks.remove(id);
    }

    protected handleEvent(e: MessageEvent) {
        const data = e.data;
        if ("string" !== typeof data || !data.startsWith(this.prefix)) {
            return;
        }
        const id = +data.substr(this.prefix.length);
        this.tasks.run(id);
    }
}
