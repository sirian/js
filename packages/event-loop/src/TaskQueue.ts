export type TaskCallback = () => any;

interface Task {
    fn: TaskCallback;
    canceled: boolean;
}

export class TaskQueue {
    private static _lastId: number = 0;

    private _tasks: Record<string, Task> = {};
    private _scheduled: boolean;
    private readonly _scheduler: (callback: () => void) => void;

    constructor(scheduler: (callback: () => void) => void) {
        this._scheduled = false;
        this._scheduler = scheduler;
    }

    public add(callback: TaskCallback) {
        const id = ++TaskQueue._lastId;
        this._tasks[id] = {
            fn: callback,
            canceled: false,
        };
        if (!this._scheduled) {
            this._scheduled = true;
            this._scheduler(() => this._run());
        }
        return id;
    }

    public cancel(id: any) {
        const task = this._tasks[id];
        if (task) {
            task.canceled = true;
        }
        delete this._tasks[id];
        return this;
    }

    private _run() {
        this._scheduled = false;

        const entries = Object.entries(this._tasks);
        for (const [id, task] of entries) {
            delete this._tasks[id];
            if (!task.canceled) {
                (async () => task.fn())();
            }
        }
    }
}
