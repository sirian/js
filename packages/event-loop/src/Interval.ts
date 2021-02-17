import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Interval extends AsyncTask {
    protected ms: number;
    protected intervalId: any;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this.ms = ms;
    }

    public restart(ms: number = this.ms) {
        this.ms = ms;
        return super.restart();
    }

    protected doClear() {
        clearInterval(this.intervalId);
    }

    protected doStart(callback: TaskCallback) {
        this.intervalId = setInterval(callback, this.ms);
    }

    protected handle(id: any) {
        if (this.id !== id) {
            return;
        }
        if (!this.destroyed && this.callback) {
            this.callback();
        }
    }
}
