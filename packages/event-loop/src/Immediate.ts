import {AsyncTask} from "./AsyncTask";
import {TaskCallback, TaskQueue} from "./TaskQueue";

const tasks = new TaskQueue((callback) => {
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

export class Immediate<T = any> extends AsyncTask {
    protected taskId?: number;

    protected clearTask() {
        tasks.cancel(this.taskId);
    }

    protected startTask(callback: TaskCallback) {
        this.taskId = tasks.add(callback);
    }
}
