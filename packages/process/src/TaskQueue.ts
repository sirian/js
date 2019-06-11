import {Func0} from "@sirian/ts-extra-types";

export class TaskQueue {
    protected handleId: number = 0;
    protected tasks = new Map<number, Func0>();

    public add(callback: () => void) {
        const id = ++this.handleId;
        this.tasks.set(id, callback);
        return id;
    }

    public run(id: number) {
        const fn = this.tasks.get(id);
        if (fn) {
            fn();
        }
    }
}
