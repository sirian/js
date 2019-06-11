import {AbstractTimeout, TimeoutCallback} from "./AbstractTimeout";

export type IntervalId = ReturnType<typeof setInterval>;

export class Interval extends AbstractTimeout {
    public static readonly active = new Map<IntervalId, Interval>();

    protected id?: IntervalId;

    constructor(ms: number, callback: () => any) {
        super(ms, callback);
    }

    public static set(ms: number, callback: TimeoutCallback) {
        return setInterval(callback, ms);
    }

    public static clear(id: IntervalId) {
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
        Interval.active.delete(id);
    }
}
