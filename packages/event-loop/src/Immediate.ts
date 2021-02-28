import {AsyncTask} from "./AsyncTask";
import {TaskCallback, TaskQueue} from "./TaskQueue";

declare const setImmediate: any;

export class Immediate<T = any> extends AsyncTask {
    protected static queue?: TaskQueue;

    private taskId?: number;

    protected doClear() {
        Immediate.queue?.cancel(this.taskId);
    }

    protected doStart(callback: TaskCallback) {
        Immediate.queue ??= new TaskQueue((fn) => {
            if ("function" === typeof setImmediate) {
                setImmediate(fn);
            } else {
                const {port1, port2} = new MessageChannel();
                port1.onmessage = fn;
                port2.postMessage("");
            }
        });

        this.taskId = Immediate.queue.add(callback);
    }

    protected handle() {
        this.clear();
        super.handle();
    }
}
