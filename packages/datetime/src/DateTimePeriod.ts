import {isNumber} from "@sirian/common";
import {DateTime} from "./DateTime";
import {DateTimeInterval, IDateTimeInterval} from "./DateTimeInterval";

export interface IDateRangeInit {
    start: DateTime;
    end?: DateTime;
    interval: Partial<IDateTimeInterval>;
    limit?: number;
}

export class DateTimePeriod {
    public start: DateTime;
    public end?: DateTime;
    public interval: DateTimeInterval;
    public limit: number;
    public direction: number;

    constructor(init: IDateRangeInit) {
        this.start = init.start;
        this.end = init.end;
        this.interval = new DateTimeInterval(init.interval);
        this.limit = isNumber(init.limit) ? Math.max(0, init.limit) : 1 / 0;

        const nextDate = DateTime.create(0).add(this.interval);
        this.direction = Math.sign(nextDate.timestampMs);
    }

    public count() {
        const start = this.start;
        const end = this.end;
        const direction = this.direction;
        const limit = this.limit;
        const interval = this.interval;

        if (!end) {
            return direction ? limit : 1 / 0;
        }

        if (!limit || direction !== Math.sign(end.timestampMs - start.timestampMs)) {
            return 0;
        }

        const date = new DateTime(start);
        for (let i = 0; i < limit; i++) {
            if (direction * (end.timestampMs - date.timestampMs) < 0) {
                return i;
            }
            date.add(interval);
        }
        return limit;
    }

    public* [Symbol.iterator]() {
        let date = new DateTime(this.start);
        const end = this.end;
        const interval = this.interval;

        const limit = this.limit;
        const direction = this.direction;

        for (let i = 0; i < limit; i++) {
            if (end && (direction * (end.timestampMs - date.timestampMs) < 0)) {
                break;
            }

            yield date;
            date = DateTime.create(date).add(interval);
        }
    }
}
