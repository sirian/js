export type TaskCallback = () => any;

interface Task {
    fn: TaskCallback;
    canceled: boolean;
}

export class TaskQueue {
    protected static lastId: number = 0;
    protected tasks: Map<number, Task> = new Map();

    protected scheduled: boolean;
    protected running: boolean;
    protected schedule: (callback: () => void) => void;

    constructor(schedule: (callback: () => void) => void) {
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

        const tasks = this.tasks;

        const ids = [...tasks.keys()];
        for (const id of ids) {
            const task = tasks.get(id);
            tasks.delete(id);
            if (task && !task.canceled) {
                const fn = task.fn;
                (async () => fn())();
            }
        }
        this.running = false;
    }
}
