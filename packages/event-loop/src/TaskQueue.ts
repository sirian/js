import {Fn, XMap} from "@sirian/common";
import {Func0} from "@sirian/ts-extra-types";

export type TaskCallback = () => any;

interface Task {
    fn: TaskCallback;
    canceled: boolean;
}

export class TaskQueue {
    protected static lastId: number = 0;
    protected tasks: XMap<number, Task> = new XMap();

    protected scheduled: boolean;
    protected running: boolean;
    protected schedule: (callback: Func0) => void;

    constructor(schedule: (callback: Func0) => void) {
        this.scheduled = false;
        this.running = false;
        this.schedule = schedule;
    }

    public add(callback: TaskCallback) {
        const id = ++TaskQueue.lastId;
        this.tasks.set(id, {
            fn: callback,
            canceled: false,
        });
        if (!this.scheduled) {
            this.scheduled = true;
            this.schedule(() => this.run());
        }
        return id;
    }

    public clear(id: any) {
        if (this.running) {
            const task = this.tasks.get(id);
            if (task) {
                task.canceled = true;
            }
        } else {
            this.tasks.delete(id);
        }
        return this;
    }

    protected run() {
        this.scheduled = false;
        this.running = true;
        const ids = [...this.tasks.keys()];
        for (const id of ids) {
            const task = this.tasks.pick(id);
            if (task && !task.canceled) {
                Fn.try(task.fn);
            }
        }
        this.running = false;
    }
}
