import {AsyncTask} from "./AsyncTask";
import {TaskCallback, TaskQueue} from "./TaskQueue";

declare const setImmediate: any;

export class Immediate<T = any> extends AsyncTask {
    protected static queue?: TaskQueue;

    protected taskId?: number;

    protected static getQueue() {
        return Immediate.queue ??= new TaskQueue((callback) => {
            if ("function" === typeof setImmediate) {
                setImmediate(callback);
            } else {
                const {port1, port2} = new MessageChannel();
                port1.onmessage = callback;
                port2.postMessage("");
            }
        });
    }

    protected doClear() {
        Immediate.getQueue().cancel(this.taskId);
    }

    protected doStart(callback: TaskCallback) {
        this.taskId = Immediate.getQueue().add(callback);
    }
}
