import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Timeout extends AsyncTask {
    private _ms: number;
    private _timeoutId: any;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this._ms = ms;
    }

    public restart(ms: number = this._ms) {
        this._ms = ms;
        return super.restart();
    }

    protected doClear() {
        clearTimeout(this._timeoutId);
    }

    protected doStart(callback: TaskCallback) {
        this._timeoutId = setTimeout(callback, this._ms);
    }

    protected handle() {
        this.clear();
        super.handle();
    }
}
