import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Interval extends AsyncTask {
    // tslint:disable:member-ordering member-access
    #ms: number;
    #intervalId: any;

    // tslint:enable

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this.#ms = ms;
    }

    public restart(ms: number = this.#ms) {
        this.#ms = ms;
        return super.restart();
    }

    protected doClear() {
        clearInterval(this.#intervalId);
    }

    protected doStart(callback: TaskCallback) {
        this.#intervalId = setInterval(callback, this.#ms);
    }
}
