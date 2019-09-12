import {Return} from "@sirian/ts-extra-types";
import {Deferred} from "@sirian/xpromise";
import {AbstractTimeout, TaskCallback} from "./AbstractTimeout";

export type TimeoutId = Return<typeof setTimeout>;

export class Timeout<T = any> extends AbstractTimeout {
    protected id?: TimeoutId;
    protected ms: number;
    protected defer: Deferred<T>;

    constructor(ms: number, callback: () => T) {
        super(callback);
        this.ms = ms;
        this.defer = new Deferred();
    }

    public static set(ms: number, callback: TaskCallback) {
        return setTimeout(callback, ms);
    }

    public static clear(id?: TimeoutId) {
        clearTimeout(id);
    }

    public start(ms: number = this.ms) {
        this.ms = ms;
        this.id = this.id || Timeout.set(ms, () => this.handle());
        return this;
    }

    public isActive() {
        return !!this.id;
    }

    public clear() {
        Timeout.clear(this.id);
        delete this.id;
        return this;
    }

    protected handle() {
        this.clear();
        return super.handle();
    }
}
