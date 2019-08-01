import {Ref, Var} from "@sirian/common";
import {TaskQueue} from "../TaskQueue";
import {ImmediateAdapter, ImmediateCallback} from "./Immediate";

export class PostMessageImmediateAdapter implements ImmediateAdapter<number> {
    public readonly tasks = new TaskQueue();
    public readonly prefix: string;
    public readonly window: Window;

    constructor(win: Window = window) {
        this.window = win;
        win.addEventListener("message", (e: MessageEvent) => this.handleEvent(e), {capture: true});
        this.prefix = "" + Math.random();
    }

    public static supports(win: Window = window) {
        return "object" === typeof win
            && Ref.hasMethod(win, "addEventListener")
            && Ref.hasMethod(win, "postMessage");
    }

    public set(fn: ImmediateCallback) {
        const id = this.tasks.add(fn);
        this.window.postMessage(this.prefix + id, "*");
        return id;
    }

    public clear(id: number) {
        this.tasks.remove(id);
    }

    protected handleEvent(e: MessageEvent) {
        const data = e.data;
        const prefix = this.prefix;
        if (!Var.isString(data) || !data.startsWith(prefix)) {
            return;
        }

        const id = data.substr(prefix.length);

        if (!/^\d+$/.test(id)) {
            return;
        }

        e.stopPropagation();
        e.stopImmediatePropagation();

        this.tasks.run(+id);
    }
}
