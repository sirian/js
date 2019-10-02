import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Interval extends AsyncTask {
    protected ms: number;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this.ms = ms;
    }

    public start(ms: number = this.ms) {
        this.id = this.id || setInterval(() => this.handle(), this.ms);

        return this;
    }

    public restart(ms: number = this.ms) {
        this.ms = ms;
        return super.restart();
    }

    public clear() {
        clearInterval(this.id);
        delete this.id;
        return this;
    }
}
