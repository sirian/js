import {Return} from "@sirian/ts-extra-types";
import {AbstractTimeout, TimeoutCallback} from "./AbstractTimeout";

export type IntervalId = Return<typeof setInterval>;

export class Interval extends AbstractTimeout {
    public static readonly active = new Map<IntervalId, Interval>();

    protected id?: IntervalId;
    protected ms: number;

    constructor(ms: number, callback: () => any) {
        super(callback);
        this.ms = ms;
    }

    public static set(ms: number, callback: TimeoutCallback) {
        return setInterval(callback, ms);
    }

    public static clear(id: IntervalId) {
        Interval.active.delete(id);
        return clearInterval(id);
    }

    protected handle() {
        return this.callback();
    }

    protected doStart() {
        this.id = Interval.set(this.ms, () => this.handle());
        Interval.active.set(this.id, this);
    }

    protected doStop() {
        const id = this.id!;
        Interval.clear(id);
    }
}
