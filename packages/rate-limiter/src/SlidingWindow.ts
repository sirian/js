import {assert} from "@sirian/common";
import {DateTime, DateTimeImmutable} from "@sirian/datetime";
import {ILimiterState} from "./ILimiterState";
import {TimeUtil} from "./TimeUtil";

export type SerializedSlidingWindow = [
    id: string,
    hitCount: number,
    intervalMs: number,
    hitCountForLastWindow: number,
    windowEndAtSec: number
];

export class SlidingWindow implements ILimiterState {
    public readonly id;
    public readonly intervalMs;
    private windowEndAtMs;
    private hitCount = 0;
    private hitCountForLastWindow = 0;
    private cached;

    constructor(id: string, intervalMs: number) {
        assert(intervalMs > 0, "The interval must be positive integer", {id, interval: intervalMs});
        this.id = id;
        this.intervalMs = intervalMs;
        this.windowEndAtMs = TimeUtil.now() + intervalMs;
        this.cached = false;
    }

    public static createFromPreviousWindow(window: SlidingWindow, intervalInSeconds: number) {
        const newW = new SlidingWindow(window.id, intervalInSeconds);
        const windowEndAtSec = window.windowEndAtMs + intervalInSeconds;

        if (DateTime.getTimestampSec() < windowEndAtSec) {
            newW.hitCountForLastWindow = window.hitCount;
            newW.windowEndAtMs = windowEndAtSec;
        }

        return newW;
    }

    public static unserialize(data: SerializedSlidingWindow) {
        const [id, hitCount, intervalSec, hitCountForLastWindow, windowEndAtSec] = data;
        const window = new SlidingWindow(id, intervalSec);
        window.cached = true;
        window.hitCount = hitCount;
        window.hitCountForLastWindow = hitCountForLastWindow;
        window.windowEndAtMs = windowEndAtSec;
        return window;
    }

    public serialize(): SerializedSlidingWindow {
        // cached is not serialized, it should only be set
        // upon first creation of the window.
        return [this.id, this.hitCount, this.intervalMs, this.hitCountForLastWindow, this.windowEndAtMs];
    }

    public getId(): string {
        return this.id;
    }

    public getExpirationMs(): number | undefined {
        if (!this.cached) {
            return 2 * this.intervalMs;
        }
    }

    public isExpired() {
        return TimeUtil.now() > this.windowEndAtMs;
    }

    public add(hits: number = 1) {
        this.hitCount += hits;
    }

    public getHitCount() {
        const startOfWindow = this.windowEndAtMs - this.intervalMs;
        const percentOfCurrentTimeFrame = Math.min((TimeUtil.now() - startOfWindow) / this.intervalMs, 1);

        return Math.trunc(this.hitCountForLastWindow * (1 - percentOfCurrentTimeFrame) + this.hitCount);
    }

    public getRetryAfter() {
        return new DateTimeImmutable(this.windowEndAtMs);
    }
}
