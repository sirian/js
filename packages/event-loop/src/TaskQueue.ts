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

        const entries = Object.entries(this.tasks);
        for (const [id, task] of entries) {
            delete this.tasks[id];
            if (!task.canceled) {
                (async () => task.fn())();
            }
        }
        this.running = false;
    }
}
