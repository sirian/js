import {Var} from "@sirian/common";
import {TaskCallback} from "../AbstractTimeout";
import {ImmediateAdapter} from "../Immediate";
import {TaskRegistry} from "../TaskRegistry";

export abstract class MessageEventAdapter implements ImmediateAdapter<number>, EventListenerObject {
    public readonly tasks = new TaskRegistry<number>();
    public rnd: any;

    protected lastId = 0;

    constructor(rnd: any) {
        this.rnd = rnd;
    }

    public set(fn: TaskCallback) {
        const id = ++this.lastId;
        this.tasks.add(id, fn);
        this.postMessage([this.rnd, id]);
        return id;
    }

    public clear(id?: number) {
        this.tasks.delete(id);
        return this;
    }

    public handleEvent(e: MessageEvent) {
        const data = e.data;

        if (!Var.isArray(data)) {
            return;
        }

        const [id, rnd] = data;

        if (rnd !== this.rnd) {
            return;
        }

        e.stopPropagation();
        e.stopImmediatePropagation();

        this.tasks.run(id);
    }

    protected abstract postMessage(data: any): void;
}
