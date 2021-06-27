import {entriesOf, keysOf} from "@sirian/common";
import {IDateTime} from "./DateTimeImmutable";

export interface IDateTimeInterval {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ms: number;
}

const keyMap = {
    years: "year",
    months: "month",
    days: "day",
    hours: "hour",
    minutes: "minute",
    seconds: "second",
    ms: "ms",
} as const;

export class DateTimeInterval implements IDateTimeInterval {
    public years!: number;
    public months!: number;
    public days!: number;
    public hours!: number;
    public minutes!: number;
    public seconds!: number;
    public ms!: number;

    constructor(interval: Partial<IDateTimeInterval> = {}, inverse = false) {
        const sign = inverse ? -1 : 1;
        for (const key of keysOf(keyMap)) {
            this[key] = sign * (interval[key] ?? 0) || 0;
        }
    }

    public static add<T extends IDateTime>(date: T, interval: Partial<IDateTimeInterval>) {
        for (const [key, field] of entriesOf(keyMap)) {
            date[field] += interval[key] ?? 0;
        }

        return date;
    }

    public static sub<T extends IDateTime>(date: T, interval: Partial<IDateTimeInterval>) {
        return DateTimeInterval.add(date, new DateTimeInterval(interval, true));
    }
}
