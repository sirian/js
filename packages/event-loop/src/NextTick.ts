import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class NextTick extends AsyncTask {
    protected doStart(callback: TaskCallback) {
        queueMicrotask(callback);
    }

    protected doClear() {
    }
}
