import {TaskCallback} from "./TaskQueue";

export abstract class AsyncTask {
    public static readonly tasks = new Map();

    private static lastId = 0;

    protected callback?: TaskCallback;
    protected id?: any;
    protected destroyed: boolean;

    constructor(callback?: TaskCallback) {
        this.callback = callback;
        this.destroyed = false;
    }

    public static create<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args);
    }

    public static start<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args).start();
    }

    public start() {
        if (!this.destroyed && !this.isScheduled()) {
            const id = ++AsyncTask.lastId;
            this.id = id;
            AsyncTask.tasks.set(id, this);
            this.startTask(this.handle.bind(this, id));
        }
        return this;
    }

    public clear() {
        const id = this.id;
        if (undefined !== id) {
            AsyncTask.tasks.delete(id);
            delete this.id;
            this.clearTask();
        }
        return this;
    }

    public restart() {
        return this.clear().start();
    }

    public destroy() {
        this.destroyed = true;
        this.clear();
        delete this.callback;
    }

    public setCallback(callback?: TaskCallback) {
        this.callback = callback;
        if (!callback) {
            this.clear();
        }
        return this;
    }

    public isScheduled() {
        return undefined !== this.id;
    }

    protected handle(id: any) {
        if (this.id !== id) {
            return;
        }
        this.clear();
        this.applyCallback();
    }

    protected async applyCallback() {
        if (!this.destroyed && this.callback) {
            this.callback();
        }
    }

    protected abstract startTask(callback: TaskCallback): any;

    protected abstract clearTask(): any;
}
