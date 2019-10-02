import {AsyncTask} from "./AsyncTask";
import {TaskQueue} from "./TaskQueue";

export class Immediate<T = any> extends AsyncTask {
    protected static readonly tasks = new TaskQueue((callback) => {
        const {setImmediate, MessageChannel} = globalThis as any;

        if ("function" === typeof setImmediate) {
            setImmediate(callback);
            return;
        }

        if ("function" === typeof MessageChannel) {
            const {port1, port2} = new MessageChannel();
            port1.onmessage = callback;
            port2.postMessage("");
            return;
        }

        return setTimeout(callback);
    });

    public start() {
        this.id = this.id || Immediate.tasks.add(() => this.handle());
        return this;
    }

    public clear() {
        Immediate.tasks.clear(this.id);
        return super.clear();
    }

    protected handle() {
        this.clear();
        return super.handle();
    }
}
