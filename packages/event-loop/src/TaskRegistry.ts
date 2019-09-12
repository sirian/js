import {XMap} from "@sirian/common";
import {TaskCallback} from "./AbstractTimeout";

export class TaskRegistry<T> {
    protected tasks: XMap<T, TaskCallback> = new XMap();

    public add(id: T, callback: TaskCallback) {
        this.tasks.set(id, callback);
        return id;
    }

    public delete(id?: T) {
        if (id) {
            this.tasks.delete(id);
        }
    }

    public run(id: any) {
        const fn = this.tasks.pick(id);

        if (fn) {
            return fn();
        }
    }
}
