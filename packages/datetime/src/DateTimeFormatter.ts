import DateTimeFormat = Intl.DateTimeFormat;
import {stringifyVar} from "@sirian/common";
import {DateTimeImmutable} from "./DateTimeImmutable";

export class DateTimeFormatter {
    protected locales?: string | string[];

    constructor(locales?: string | string[]) {
        this.locales = locales;
    }

    public static pad(value: string | number, length: number = 2) {
        return stringifyVar(+value || 0)
            .substr(0, length)
            .padStart(length, "0");
    }

    public static formatToParts(dt: DateTimeImmutable, formatter: DateTimeFormat) {
        const parts = formatter.formatToParts(new Date(dt.timestampMs));
        const obj: Partial<Record<Intl.DateTimeFormatPartTypes, string>> = {};
        for (const part of parts) {
            obj[part.type] = part.value;
        }
        return obj as Record<Intl.DateTimeFormatPartTypes, string>;
    }

    public static format(dt: DateTimeImmutable, mask: string, locales?: string | string[]) {
        const parts = this.getParts(dt, "numeric", locales);
        const long = this.getParts(dt, "long", locales);
        const short = this.getParts(dt, "short", locales);

        const pad = DateTimeFormatter.pad;

        const tokens: Record<string, string | number> = {
            YYYY: pad(parts.year, 4),
            YY: pad(parts.year.substr(-2)),
            Y: parts.year,

            MMMM: long.month,
            MMM: short.month,
            MM: pad(parts.month),
            M: parts.month,

            DDDD: long.weekday,
            DDD: short.weekday,
            DD: pad(parts.day),
            D: parts.day,

            HH: pad(parts.hour),
            H: parts.hour,

            hh: pad(parts.hour),
            h: parts.hour,

            mm: pad(parts.minute),
            m: parts.minute,

            sss: pad(dt.ms, 3),
            ss: pad(parts.second),
            s: parts.second,
        };

        const re = new RegExp(Object.keys(tokens).join("|"), "g");

        return stringifyVar(mask).replace(re, (token) => String(tokens[token]));
    }

    protected static getParts(date: DateTimeImmutable, type: "numeric" | "long" | "short", locale?: string | string[]) {
        const options: Intl.DateTimeFormatOptions = {
            timeZone: "UTC",
            weekday: "narrow",
            era: "narrow",
            year: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
        };

        switch (type) {
            case "long":
            case "short":
                Object.assign(options, {
                    weekday: type,
                    era: type,
                    month: type,
                });
                break;
            case "numeric":
                options.month = "numeric";
                break;
        }

        const formatter = new Intl.DateTimeFormat(locale, options);

        return this.formatToParts(date, formatter);
    }
}
