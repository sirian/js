import {Return} from "@sirian/ts-extra-types";
import {AbstractTimeout, TimeoutCallback} from "./AbstractTimeout";

export type TimeoutId = Return<typeof setTimeout>;

export class Timeout extends AbstractTimeout {
    public static readonly active = new Map<TimeoutId, Timeout>();

    protected id?: TimeoutId;
    protected ms: number;

    constructor(ms: number, callback: () => any) {
        super(callback);
        this.ms = ms;
    }

    public static set(ms: number, callback: TimeoutCallback) {
        return setTimeout(callback, ms);
    }

    public static clear(id: TimeoutId) {
        this.active.delete(id);
        return clearTimeout(id);
    }

    protected handle() {
        this.stop();
        return this.callback();
    }

    protected doStart() {
        this.id = Timeout.set(this.ms, () => this.handle());
        Timeout.active.set(this.id, this);
    }

    protected doStop() {
        Timeout.clear(this.id!);
    }
}
