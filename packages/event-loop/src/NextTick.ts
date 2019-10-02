import {AsyncTask} from "./AsyncTask";
import {TaskQueue} from "./TaskQueue";

export class NextTick extends AsyncTask {
    protected static tasks = new TaskQueue((callback) => Promise.resolve().then(callback));

    public start() {
        this.id = this.id || NextTick.tasks.add(() => this.handle());
        return this;
    }

    public clear() {
        NextTick.tasks.clear(this.id);
        return super.clear();
    }
}
