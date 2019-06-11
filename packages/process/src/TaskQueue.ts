import {Func0} from "@sirian/ts-extra-types";

export class TaskQueue {
    protected handleId: number = 0;
    protected tasks = new Map<number, Func0>();

    public add(callback: () => void) {
        const id = ++this.handleId;
        this.tasks.set(id, callback);
        return id;
    }

    public remove(id: number) {
        this.tasks.delete(id);
    }

    public run(id: number) {
        const tasks = this.tasks;
        if (!tasks.has(id)) {
            return;
        }
        const fn = tasks.get(id)!;
        tasks.delete(id);
        return fn();
    }
}
