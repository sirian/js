import {IDateTimeInterval} from "@sirian/datetime";
import {ILimiter} from "./ILimiter";
import {IStorage} from "./IStorage";
import {RateLimit} from "./RateLimit";
import {SlidingWindow} from "./SlidingWindow";
import {dateIntervalToMs} from "./TimeUtil";

export class SlidingWindowLimiter implements ILimiter {
    public readonly id: string;
    public readonly limit: number;
    public readonly storage: IStorage<SlidingWindow>;
    public readonly interval: number;

    constructor(id: string, limit: number, interval: Partial<IDateTimeInterval>, storage: IStorage<SlidingWindow>) {
        this.storage = storage;
        this.id = id;
        this.limit = limit;
        this.interval = dateIntervalToMs(interval);
    }

    public consume(tokens: number = 1): RateLimit {
        const item = this.storage.fetch(this.id, (d) => SlidingWindow.unserialize(d)) ?? new SlidingWindow(this.id, this.interval);

        const win = item.isExpired() ? SlidingWindow.from(item, this.interval) : item;

        const hitCount = win.getHitCount();
        const availableTokens = this.limit - hitCount;

        if (availableTokens < tokens) {
            return new RateLimit(availableTokens, win.getRetryAfter(), false, this.limit);
        }

        win.add(tokens);
        this.storage.save(win);

        return new RateLimit(this.limit - win.getHitCount(), win.getRetryAfter(), true, this.limit);
    }

    public reset() {
        this.storage.delete(this.id);
    }
}
