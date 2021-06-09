import {AsyncTask} from "./AsyncTask";
import {clearAlarm, setAlarm} from "./setAlarm";
import {TaskCallback} from "./TaskQueue";

export class Alarm extends AsyncTask {
    private _ms: number;
    private _alarmId: any;

    constructor(ms: number, callback?: TaskCallback) {
        super(callback);
        this._ms = ms;
    }

    public restart(ms: number = this._ms) {
        this._ms = ms;
        return super.restart();
    }

    protected _clear() {
        if (this._alarmId) {
            clearAlarm(this._alarmId);
            delete this._alarmId;
        }
    }

    protected _start(callback: TaskCallback) {
        this._alarmId = setAlarm(this._ms, callback);
    }

    protected _handle() {
        this.clear();
        super._handle();
    }
}
