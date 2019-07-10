import {Var} from "@sirian/common";
import {DateTimeDiff} from "./DateTimeDiff";
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

export class DateTimeImmutable implements IDateTime {
    protected date: Date;

    constructor(value: DateArg = "now") {
        let ms: number;
        if (Var.isInstanceOf(value, DateTimeImmutable)) {
            ms = value.timestampMs;
        } else if (Var.isString(value)) {
            ms = DateTimeParser.parse(value);
        } else {
            ms = +value;
        }

        this.date = new Date(ms);
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

        return Math.trunc(sec);
    }

    public get timestampMs() {
        return this.date.getTime();
    }

    public get timeZoneOffset() {
        return this.date.getTimezoneOffset();
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
            + Math.floor((y - 1969) / 4)
            - Math.floor((y - 1901) / 100)
            + Math.floor((y - 1601) / 400);
    }

    public static getTimestampMs() {
        return Date.now();
    }

    public static getTimestampSec(truncate: boolean = true) {
        const sec = this.getTimestampMs() / 1000;

        return truncate ? Math.trunc(sec) : sec;
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

    public static from<T>(this: new(value: DateArg) => T, value: DateArg) {
        return new this(value);
    }

    public daysInMonth() {
        return DateTimeImmutable.daysInMonth(this.year, this.month);
    }

    public diff(date: DateArg): DateTimeInterval {
        return DateTimeDiff.diff(this, date);
    }

    public isValid() {
        return Number.isFinite(this.timestampMs);
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
        return new Date(this.timestampMs);
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

    public toArray(): [number, number, number, number, number, number, number] {
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
