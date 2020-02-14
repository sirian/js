import {entriesOf, hasOwn} from "@sirian/common";
import {DateTimeImmutable, IDateTime} from "./DateTimeImmutable";
import {DateTimeInterval, IDateInterval} from "./DateTimeInterval";
import {DateTimeModifier} from "./DateTimeModifier";

export class DateTime extends DateTimeImmutable {
    public static readonly formats = {
        default: "YYYY-MM-DD HH:mm:ss",
        date: "YYYY-MM-DD",
        time: "HH:mm:ss",
        iso: "YYYY-MM-DDTHH:mm:ssZ",
    };

    public get year() {
        return this.date.getUTCFullYear();
    }

    public set year(value: number) {
        this.setYear(value);
    }

    public get month() {
        return 1 + this.date.getUTCMonth();
    }

    public set month(value: number) {
        this.setMonth(value);
    }

    public get day() {
        return this.date.getUTCDate();
    }

    public set day(value: number) {
        this.setDay(value);
    }

    public get hour() {
        return this.date.getUTCHours();
    }

    public set hour(value: number) {
        this.setHour(value);
    }

    public get minute() {
        return this.date.getUTCMinutes();
    }

    public set minute(value: number) {
        this.setMinute(value);
    }

    public get second() {
        return this.date.getUTCSeconds();
    }

    public set second(value: number) {
        this.setSecond(value);
    }

    public get ms() {
        return this.date.getUTCMilliseconds();
    }

    public set ms(value: number) {
        this.setMs(value);
    }

    public startOfDay() {
        this.setTime(0, 0, 0, 0);
        return this;
    }

    public setTime(h: number, m: number = 0, s: number = 0, ms: number = 0) {
        this.hour = h;
        this.minute = m;
        this.second = s;
        this.ms = ms;
        return this;
    }

    public endOfDay() {
        this.setTime(23, 59, 59, 999);
        return this;
    }

    public setHour(value: number) {
        this.date.setUTCHours(value);
        return this;
    }

    public setMinute(value: number) {
        this.date.setUTCMinutes(value);
        return this;
    }

    public setSecond(value: number) {
        this.date.setUTCSeconds(value);
        return this;
    }

    public setMs(value: number) {
        this.date.setUTCMilliseconds(value);
        return this;
    }

    public setYear(value: number) {
        this.date.setUTCFullYear(value);
        return this;
    }

    public setMonth(value: number) {
        this.date.setUTCMonth(value - 1);
        return this;
    }

    public setDay(value: number) {
        this.date.setUTCDate(value);
        return this;
    }

    public modify(pattern: string) {
        DateTimeModifier.modify(this, pattern);
        return this;
    }

    public add(interval: Partial<IDateInterval> = {}) {
        const it = new DateTimeInterval(interval);

        const map: Record<keyof IDateInterval, keyof IDateTime> = {
            years: "year",
            months: "month",
            days: "day",
            hours: "hour",
            minutes: "minute",
            seconds: "second",
            ms: "ms",
        };

        for (const [key, value] of entriesOf(it)) {
            if (!value || !hasOwn(map, key)) {
                continue;
            }
            const field = map[key];
            this[field] = this[field] + value;
        }

        return this;
    }

    public sub(value: Partial<IDateInterval>) {
        const interval = new DateTimeInterval(value, true);

        return this.add(interval);
    }

    public clone(): DateTime {
        return new DateTime(this);
    }
}
