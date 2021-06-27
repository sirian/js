export type TaskCallback = () => any;

type Task = [fn: TaskCallback, canceled: boolean];

export class TaskQueue {
    private static _lastId = 0;

    private _tasks: Record<string, Task> = {};
    private _scheduled = false;
    private readonly _scheduler: (callback: () => void) => void;

    constructor(scheduler: (callback: () => void) => void) {
        this._scheduler = scheduler;
    }

    public add(callback: TaskCallback) {
        const id = ++TaskQueue._lastId;
        this._tasks[id] = [callback, false];

        if (!this._scheduled) {
            this._scheduled = true;
            this._scheduler(() => this._run());
        }
        return id;
    }

    public cancel(id: any) {
        const task = this._tasks[id];
        if (task) {
            task[1] = true;
        }
        delete this._tasks[id];
        return this;
    }

    private _run() {
        this._scheduled = false;

        const entries = Object.entries(this._tasks);
        entries.forEach(([id, [fn, canceled]]) => {
            delete this._tasks[id];
            if (!canceled) {
                (async () => fn())();
            }
        });
    }
}
