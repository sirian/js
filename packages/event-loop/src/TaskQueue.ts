export type TaskCallback = () => any;

interface Task {
    fn: TaskCallback;
    canceled: boolean;
}

export class TaskQueue {
    protected static lastId: number = 0;
    protected tasks: Record<string, Task> = {};

    protected scheduled: boolean;
    protected running: boolean;
    protected scheduler: (callback: () => void) => void;

    constructor(scheduler: (callback: () => void) => void) {
        this.scheduled = false;
        this.running = false;
        this.scheduler = scheduler;
    }

    public add(callback: TaskCallback) {
        const id = ++TaskQueue.lastId;
        this.tasks[id] = {
            fn: callback,
            canceled: false,
        };
        if (!this.scheduled) {
            this.scheduled = true;
            this.scheduler(() => this.run());
        }
        return id;
    }

    public cancel(id: any) {
        const task = this.tasks[id];
        if (task) {
            task.canceled = true;
        }
        delete this.tasks[id];
        return this;
    }

    protected run() {
        this.scheduled = false;
        this.running = true;

        const tasks = this.tasks;

        const apply = async (fn: TaskCallback) => fn();

        const entries = Object.entries(tasks);
        for (const [id, {canceled, fn}] of entries) {
            delete tasks[id];
            if (!canceled) {
                apply(fn);
            }
        }
        this.running = false;
    }
}
