import {AsyncTask} from "./AsyncTask";
import {setImmediate} from "./setImmediate";
import {TaskCallback, TaskQueue} from "./TaskQueue";

export class Immediate<T = any> extends AsyncTask {
    private static _queue?: TaskQueue;

    private _taskId?: number;

    protected _clear() {
        this._getQueue().cancel(this._taskId);
    }

    protected _start(callback: TaskCallback) {
        this._taskId = this._getQueue().add(callback);
    }

    protected _handle() {
        this.clear();
        super._handle();
    }

    private _getQueue() {
        return Immediate._queue ??= new TaskQueue((fn) => setImmediate(fn));
    }
}
