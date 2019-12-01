import {AsyncTask} from "./AsyncTask";
import {TaskCallback} from "./TaskQueue";

export class NextTick extends AsyncTask {
    protected startTask(callback: TaskCallback) {
        Promise.resolve().then(callback);
    }

    protected clearTask() {
    }
}
