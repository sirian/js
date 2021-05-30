import {TaskCallback} from "./TaskQueue";

export abstract class AsyncTask {
    private static readonly _tasks = new Map<number, AsyncTask>();

    private static _lastId = 0;

    private _callback?: TaskCallback;
    private _id?: number;
    private _destroyed: boolean = false;

    constructor(callback?: TaskCallback) {
        this._callback = callback;
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
            AsyncTask._tasks.set(id, this);
            this._start(() => !this._destroyed && id === this._id && this._handle());
        }
        return this;
    }

    public clear() {
        if (this._id) {
            AsyncTask._tasks.delete(this._id);
            delete this._id;
        }
        this._clear();
        return this;
    }

    public restart() {
        return this.clear().start();
    }

    public destroy() {
        this._destroyed = true;
        delete this._callback;
        this.clear();
    }

    public setCallback(callback?: TaskCallback) {
        if (!this._destroyed) {
            this._callback = callback;
        }
        if (!callback) {
            this.clear();
        }
        return this;
    }

    public isScheduled() {
        return !!this._id;
    }

    protected _handle() {
        this._callback?.();
    }

    protected abstract _start(callback: TaskCallback): void;

    protected abstract _clear(): void;
}
