import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Timeout extends AsyncTask {
    protected ms: number;
    protected timeoutId: any;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this.ms = ms;
    }

    public restart(ms: number = this.ms) {
        this.ms = ms;
        return super.restart();
    }

    protected clearTask() {
        clearTimeout(this.timeoutId);
    }

    protected startTask(callback: TaskCallback) {
        this.timeoutId = setTimeout(callback, this.ms);
    }
}
