import {performance} from "@sirian/performance";
import {TimerPeriod} from "./TimerPeriod";

export interface TimerOptions {
    now: () => number;
}

export class Timer {
    protected periods: TimerPeriod[];

    protected starts: number[];
    protected options: TimerOptions;

    constructor(options: Partial<TimerOptions> = {}) {
        this.starts = [];
        this.periods = [];
        this.options = {
            now: performance.now,
            ...options,
        };
    }

    public getPeriods() {
        return [...this.periods];
    }

    public reset() {
        this.starts = [];
        this.periods = [];
        return this;
    }

    public getDuration() {
        const now = this.now();
        return this.periods.reduce((sum, period) => sum + period.duration, 0)
            + this.starts.reduce((sum, startAt) => sum + (now - startAt), 0);
    }

    public stopAll() {
        while (this.starts.length) {
            this.stop();
        }
    }

    public stop() {
        if (this.starts.length) {
            this.periods.push(new TimerPeriod(this.starts.pop()!, this.now()));
        }

        return this;
    }

    public isStarted() {
        return this.starts.length > 0;
    }

    public lap() {
        return this.stop().start();
    }

    public start() {
        this.starts.push(this.now());
        return this;
    }

    public now() {
        return this.options.now();
    }
}
