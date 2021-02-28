import {TaskCallback} from "./TaskQueue";

export abstract class AsyncTask {
    public static readonly tasks = new Map();

    // tslint:disable:member-ordering member-access
    private static lastId = 0;

    #callback: TaskCallback | undefined;
    #id: any;
    #destroyed: boolean;

    // tslint:enable

    constructor(callback?: TaskCallback) {
        this.#callback = callback;
        this.#destroyed = false;
    }

    public static create<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args);
    }

    public static start<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args).start();
    }

    public start() {
        if (!this.#destroyed && !this.isScheduled()) {
            const id = ++AsyncTask.lastId;
            this.#id = id;
            AsyncTask.tasks.set(id, this);
            this.doStart(() => !this.#destroyed && id === this.#id && this.handle());
        }
        return this;
    }

    public clear() {
        AsyncTask.tasks.delete(this.#id);
        this.#id = undefined;
        this.doClear();
        return this;
    }

    public restart() {
        return this.clear().start();
    }

    public destroy() {
        this.#destroyed = true;
        this.clear();
        this.#callback = undefined;
    }

    public setCallback(callback?: TaskCallback) {
        this.#callback = callback;
        if (!callback) {
            this.clear();
        }
        return this;
    }

    public isScheduled() {
        return undefined !== this.#id;
    }

    protected handle() {
        this.#callback?.();
    }

    protected abstract doStart(callback: TaskCallback): any;

    protected abstract doClear(): any;
}
