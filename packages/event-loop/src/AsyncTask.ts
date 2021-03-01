import {TaskCallback} from "./TaskQueue";

export abstract class AsyncTask {
    public static readonly tasks = new Map();

    private static _lastId = 0;

    private _callback: TaskCallback | undefined;
    private _id: any;
    private _destroyed: boolean;

    constructor(callback?: TaskCallback) {
        this._callback = callback;
        this._destroyed = false;
    }

    public static create<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args);
    }

    public static start<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args).start();
    }

    public start() {
        if (!this._destroyed && !this.isScheduled()) {
            const id = ++AsyncTask._lastId;
            this._id = id;
            AsyncTask.tasks.set(id, this);
            this.doStart(() => !this._destroyed && id === this._id && this.handle());
        }
        return this;
    }

    public clear() {
        AsyncTask.tasks.delete(this._id);
        this._id = undefined;
        this.doClear();
        return this;
    }

    public restart() {
        return this.clear().start();
    }

    public destroy() {
        this._destroyed = true;
        this.clear();
        this._callback = undefined;
    }

    public setCallback(callback?: TaskCallback) {
        this._callback = callback;
        if (!callback) {
            this.clear();
        }
        return this;
    }

    public isScheduled() {
        return undefined !== this._id;
    }

    protected handle() {
        this._callback?.();
    }

    protected abstract doStart(callback: TaskCallback): any;

    protected abstract doClear(): any;
}
