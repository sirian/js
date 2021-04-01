import {isFinite, isInstanceOf, isString, toInt} from "@sirian/common";
import {DateTimeFormatter} from "./DateTimeFormatter";
import {DateTimeInterval} from "./DateTimeInterval";
import {DateTimeParser} from "./DateTimeParser";

export interface TimeParts {
    hour: number;
    minute: number;
    second: number;
    ms: number;
}

export interface DateParts {
    year: number;
    month: number;
    day: number;
}

export type IDateTime = DateParts & TimeParts;

export type DateArg = Date | DateTimeImmutable | string | number | undefined;

export type DateTimePartsArray = [year: number, month: number, day: number, hour: number, minute: number, second: number, ms: number];

export class DateTimeImmutable implements IDateTime {
    protected date: Date;

    constructor(value: DateArg = "now") {
        let ms: number;
        if (isInstanceOf(value, DateTimeImmutable)) {
            ms = value.timestampMs;
        } else if (isString(value)) {
            ms = DateTimeParser.parse(value);
        } else {
            ms = +value;
        }

        this.date = new Date(ms);
    }

    public static parse(str: string) {
        return DateTimeParser.parse(str);
    }

    public static isLeapYear(year: number) {
        return 0 === year % 400 || (0 !== year % 100 && 0 === year % 4);
    }

    public static daysInYear(year: number) {
        return this.isLeapYear(year) ? 366 : 365;
    }

    public static dayFromYear(y: number) {
        return 365 * (y - 1970)
            + toInt((y - 1969) / 4)
            - toInt((y - 1901) / 100)
            + toInt((y - 1601) / 400);
    }

    public static getTimestampMs() {
        return Date.now();
    }

    public static getTimestampSec(truncate: boolean = true) {
        const sec = this.getTimestampMs() / 1000;

        return truncate ? toInt(sec) : sec;
    }

    public static daysInMonth(year: number, month: number) {
        if (isNaN(year) || isNaN(month)) {
            return NaN;
        }
        const month0 = month - 1;

        const modMonth = month0 % 12;
        year += (month0 - modMonth) / 12;

        return modMonth === 1 ? (this.isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
    }

    public static diff(m1: DateTimeImmutable, m2: DateTimeImmutable): DateTimeInterval {
        if (m1.isEqual(m2)) {
            return new DateTimeInterval();
        }

        const inverse = m1.isAfter(m2);

        if (inverse) {
            [m1, m2] = [m2, m1];
        }

        let years = m2.year - m1.year;
        let months = m2.month - m1.month;
        let days = m2.day - m1.day;
        let hours = m2.hour - m1.hour;
        let minutes = m2.minute - m1.minute;
        let seconds = m2.second - m1.second;
        let ms = m2.ms - m1.ms;

        if (ms < 0) {
            ms += 1000;
            --seconds;
        }

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }

        if (minutes < 0) {
            minutes += 60;
            hours--;
        }

        if (hours < 0) {
            hours += 24;
            days--;
        }

        if (days < 0) {
            const prevMonth = m2.month === 1 ? 12 : m2.month;
            const prevYear = m2.month === 1 ? m2.year - 1 : m2.year;
            const daysInLastFullMonth = DateTimeImmutable.daysInMonth(prevYear, prevMonth);

            if (daysInLastFullMonth < m1.day) { // 31/01 -> 2/03
                days = daysInLastFullMonth + days + (m1.day - daysInLastFullMonth);
            } else {
                days = daysInLastFullMonth + days;
            }

            months--;
        }

        if (months < 0) {
            months += 12;
            years--;
        }

        return new DateTimeInterval({
            years,
            months,
            days,
            hours,
            minutes,
            seconds,
            ms,
        }, inverse);
    }

    public static create<T extends IDateTime>(this: new(value: DateArg) => T, value: DateArg = "now") {
        return new this(value);
    }

    /** @deprecated */
    public static from<T extends IDateTime>(this: new(value: DateArg) => T, value: DateArg = "now") {
        return new this(value);
    }

    public get year() {
        return this.date.getUTCFullYear();
    }

    public get month() {
        return 1 + this.date.getUTCMonth();
    }

    public get day() {
        return this.date.getUTCDate();
    }

    public get hour() {
        return this.date.getUTCHours();
    }

    public get minute() {
        return this.date.getUTCMinutes();
    }

    public get second() {
        return this.date.getUTCSeconds();
    }

    public get ms() {
        return this.date.getUTCMilliseconds();
    }

    public get timestampSec() {
        const sec = this.timestampMs / 1000;

        return toInt(sec);
    }

    public get timestampMs() {
        return this.date.getTime();
    }

    public get timeZoneOffset() {
        return this.date.getTimezoneOffset();
    }

    public daysInMonth() {
        return DateTimeImmutable.daysInMonth(this.year, this.month);
    }

    public diff(date: DateArg): DateTimeInterval {
        return DateTimeImmutable.diff(this, new DateTimeImmutable(date));
    }

    public isValid() {
        return isFinite(this.timestampMs);
    }

    public toString() {
        return this.date.toISOString();
    }

    public isEqual(date: DateTimeImmutable) {
        return this.timestampMs === date.timestampMs;
    }

    public isAfter(date: DateTimeImmutable) {
        return this.timestampMs > date.timestampMs;
    }

    public isBefore(date: DateTimeImmutable) {
        return this.timestampMs < date.timestampMs;
    }

    public clone(): DateTimeImmutable {
        return new DateTimeImmutable(this);
    }

    public format(mask: string, locales?: string | string[]) {
        return DateTimeFormatter.format(this, mask, locales);
    }

    public toDate() {
        return new Date(this.date);
    }

    public toJSON(): IDateTime {
        return {
            year: this.year,
            month: this.month,
            day: this.day,
            hour: this.hour,
            minute: this.minute,
            second: this.second,
            ms: this.ms,
        };
    }

    public toArray(): DateTimePartsArray {
        return [
            this.year,
            this.month,
            this.day,
            this.hour,
            this.minute,
            this.second,
            this.ms,
        ];
    }
}
