import {TaskCallback} from "./TaskQueue";

export abstract class AsyncTask {
    protected callback?: TaskCallback;
    protected id?: any;

    constructor(callback?: TaskCallback) {
        this.callback = callback;
    }

    public static create<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args);
    }

    public static start<T extends AsyncTask, A extends any[]>(this: new(...args: A) => T, ...args: A) {
        return new this(...args).start();
    }

    public abstract start(): this;

    public clear() {
        delete this.id;
        return this;
    }

    public restart() {
        return this.clear().start();
    }

    public setCallback(callback?: TaskCallback) {
        this.callback = callback;
        if (!callback) {
            this.clear();
        }
        return this;
    }

    public isActive() {
        return !!this.id;
    }

    protected handle() {
        return this.callback && this.callback();
    }
}
