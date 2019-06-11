import {AbstractTimeout, TimeoutCallback} from "./AbstractTimeout";

export type TimeoutId = ReturnType<typeof setTimeout>;

export class Timeout extends AbstractTimeout {
    public static readonly active = new Map<TimeoutId, Timeout>();

    protected id?: TimeoutId;

    constructor(ms: number, callback: () => any) {
        super(ms, callback);
    }

    public static set(ms: number, callback: TimeoutCallback) {
        return setTimeout(callback, ms);
    }

    public static clear(id: TimeoutId) {
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
        const id = this.id!;
        Timeout.clear(id);
        Timeout.active.delete(id);
    }
}
