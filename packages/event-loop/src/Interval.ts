import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class Interval extends AsyncTask {

    private _ms: number;
    private _intervalId: any;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this._ms = ms;
    }

    public restart(ms: number = this._ms) {
        this._ms = ms;
        return super.restart();
    }

    protected _clear() {
        if (this._intervalId) {
            clearInterval(this._intervalId);
            delete this._intervalId;
        }
    }

    protected _start(callback: TaskCallback) {
        this._intervalId = setInterval(callback, this._ms);
    }
}
