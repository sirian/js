import {IDateTimeInterval} from "@sirian/datetime";

export const dateIntervalToMs = (interval: Partial<IDateTimeInterval>) => {
    return (interval.ms ?? 0)
        + (interval.seconds ?? 0) * 1000
        + (interval.minutes ?? 0) * 60 * 1000
        + (interval.hours ?? 0) * 3600 * 1000
        + (interval.days ?? 0) * 3600 * 24 * 1000;
};

export class TimeUtil {
    public static now() {
        return Date.now();
    }
}
