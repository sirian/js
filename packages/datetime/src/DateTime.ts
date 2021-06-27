import {DateTimeImmutable} from "./DateTimeImmutable";
import {DateTimeInterval, IDateTimeInterval} from "./DateTimeInterval";
import {DateTimeModifier} from "./DateTimeModifier";

export class DateTime extends DateTimeImmutable {
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

    public setTime(h: number, m = 0, s = 0, ms = 0) {
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

    public add(interval: Partial<IDateTimeInterval> = {}) {
        DateTimeInterval.add(this, interval);
        return this;
    }

    public sub(interval: Partial<IDateTimeInterval>) {
        DateTimeInterval.sub(this, interval);
        return this;
    }

    public clone(): DateTime {
        return new DateTime(this);
    }
}
