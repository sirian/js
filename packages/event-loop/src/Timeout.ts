import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Timeout extends AsyncTask {
    protected ms: number;

    constructor(ms: number, callback: TaskCallback) {
        super(callback);
        this.ms = ms;
    }

    public start() {
        this.id = this.id || setTimeout(() => this.handle(), this.ms);
        return this;
    }

    public restart(ms: number = this.ms) {
        this.ms = ms;
        return super.restart();
    }

    public clear() {
        clearTimeout(this.id);
        return super.clear();
    }

    protected handle() {
        this.clear();
        return super.handle();
    }
}
