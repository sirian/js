import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Interval extends AsyncTask {
    protected ms: number;

    constructor(ms: number, callback: () => any) {
        super(callback);
        this.ms = ms;
    }

    public static set(ms: number, callback: TaskCallback) {
        return setInterval(callback, ms);
    }

    public static clear(id?: any) {
        clearInterval(id);
    }

    public start(ms: number = this.ms) {
        this.id = this.id || Interval.set(this.ms, () => this.handle());

        return this;
    }

    public restart(ms: number = this.ms) {
        this.ms = ms;
        return super.restart();
    }

    public clear() {
        Interval.clear(this.id);
        delete this.id;
        return this;
    }
}
