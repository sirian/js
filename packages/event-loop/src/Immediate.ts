import {AbstractTimeout, TaskCallback} from "./AbstractTimeout";
import {AutoAdapter} from "./ImmediateAdapter";

export interface ImmediateAdapter<T = any> {
    set: (fn: TaskCallback) => T;
    clear: (id: T) => void;
}

export class Immediate<T = any> extends AbstractTimeout {
    public static adapter = new AutoAdapter();

    protected id?: any;
    protected adapter: ImmediateAdapter;

    constructor(callback: TaskCallback, adapter: ImmediateAdapter<T>) {
        super(callback);
        this.adapter = adapter || Immediate.adapter;
    }

    public static set(ms: number, callback: TaskCallback) {
        return setInterval(callback, ms);
    }

    public static clear(id?: any) {
        clearInterval(id);
    }

    public start() {
        if (!this.id) {
            this.id = this.adapter.set(() => {
                this.clear();
                return this.callback && this.callback();
            });
        }
        return this;
    }

    public isActive() {
        return !!this.id;
    }

    public clear() {
        this.adapter.clear(this.id);
        return this;
    }
}
