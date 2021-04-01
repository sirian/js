import {assert} from "@sirian/common";
import {DateTime} from "@sirian/datetime";
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

    private _windowEndAtMs;
    private _hitCount = 0;
    private _hitCountForLastWindow = 0;
    private _cached;

    constructor(id: string, intervalMs: number) {
        assert(intervalMs > 0, "The interval must be positive integer", {id, interval: intervalMs});
        this.id = id;
        this.intervalMs = intervalMs;
        this._windowEndAtMs = TimeUtil.now() + intervalMs;
        this._cached = false;
    }

    public static from(previous: SlidingWindow, intervalMs: number) {
        const windoww = new SlidingWindow(previous.id, intervalMs);
        const windowEndAtSec = previous._windowEndAtMs + intervalMs;

        if (DateTime.getTimestampSec() < windowEndAtSec) {
            windoww._hitCountForLastWindow = previous._hitCount;
            windoww._windowEndAtMs = windowEndAtSec;
        }

        return windoww;
    }

    public static unserialize(data: SerializedSlidingWindow) {
        const [id, hitCount, intervalSec, hitCountForLastWindow, windowEndAtSec] = data;
        const window = new SlidingWindow(id, intervalSec);
        window._cached = true;
        window._hitCount = hitCount;
        window._hitCountForLastWindow = hitCountForLastWindow;
        window._windowEndAtMs = windowEndAtSec;
        return window;
    }

    public serialize(): SerializedSlidingWindow {
        // cached is not serialized, it should only be set
        // upon first creation of the window.
        return [this.id, this._hitCount, this.intervalMs, this._hitCountForLastWindow, this._windowEndAtMs];
    }

    public getId(): string {
        return this.id;
    }

    public getExpirationMs(): number | undefined {
        if (!this._cached) {
            return 2 * this.intervalMs;
        }
    }

    public isExpired() {
        return TimeUtil.now() > this._windowEndAtMs;
    }

    public add(hits: number = 1) {
        this._hitCount += hits;
    }

    public getHitCount() {
        const startOfWindow = this._windowEndAtMs - this.intervalMs;
        const percentOfCurrentTimeFrame = Math.min((TimeUtil.now() - startOfWindow) / this.intervalMs, 1);

        return Math.trunc(this._hitCountForLastWindow * (1 - percentOfCurrentTimeFrame) + this._hitCount);
    }

    public getRetryAfter() {
        return this._windowEndAtMs;
    }
}
