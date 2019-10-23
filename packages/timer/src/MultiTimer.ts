import {Timer, TimerOptions} from "./Timer";

export class MultiTimer {
    protected readonly timers: Map<any, Timer>;
    protected options: Partial<TimerOptions>;

    constructor(options: Partial<TimerOptions> = {}) {
        this.options = options;
        this.timers = new Map();
    }

    public start(id: any) {
        this.get(id).start();
        return this;
    }

    public stop(id: any) {
        if (this.has(id)) {
            this.get(id).stop();
        }
        return this;
    }

    public has(id: any) {
        return this.timers.has(id);
    }

    public reset(id: any) {
        if (this.has(id)) {
            this.get(id).reset();
        }
        return this;
    }

    public delete(id: any) {
        this.timers.delete(id);
        return this;
    }

    public lap(id: any) {
        this.get(id).lap();
        return this;
    }

    public stopAll() {
        this.timers.forEach((timer) => timer.stopAll());
        return this;
    }

    public all() {
        return this.timers;
    }

    public get(id: any) {
        const timers = this.timers;
        if (!timers.has(id)) {
            timers.set(id, new Timer(this.options));
        }
        return timers.get(id)!;
    }
}
