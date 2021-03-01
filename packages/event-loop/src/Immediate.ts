import {AsyncTask} from "./AsyncTask";
import {TaskCallback, TaskQueue} from "./TaskQueue";

declare const setImmediate: any;

export class Immediate<T = any> extends AsyncTask {
    private static _queue?: TaskQueue;

    private _taskId?: number;

    protected doClear() {
        Immediate._queue?.cancel(this._taskId);
    }

    protected doStart(callback: TaskCallback) {
        Immediate._queue ??= new TaskQueue((fn) => {
            if ("function" === typeof setImmediate) {
                setImmediate(fn);
            } else {
                const {port1, port2} = new MessageChannel();
                port1.onmessage = fn;
                port2.postMessage("");
            }
        });

        this._taskId = Immediate._queue.add(callback);
    }

    protected handle() {
        this.clear();
        super.handle();
    }
}
