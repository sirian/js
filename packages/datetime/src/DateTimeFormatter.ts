import DateTimeFormat = Intl.DateTimeFormat;
import {fromEntries, keysOf, stringifyVar} from "@sirian/common";
import {DateTimeImmutable} from "./DateTimeImmutable";
import {formatNumber} from "./DateUtil";

export class DateTimeFormatter {
    public static formatToParts(dt: DateTimeImmutable, formatter: DateTimeFormat) {
        const parts = formatter.formatToParts(new Date(dt.timestampMs));
        return fromEntries(parts.map((part) => [part.type, part.value] as [Intl.DateTimeFormatPartTypes, string]));
    }

    public static format(dt: DateTimeImmutable, mask: string, locales?: string | string[]) {
        const parts = this._getParts(dt, "numeric", locales);
        const long = this._getParts(dt, "long", locales);
        const short = this._getParts(dt, "short", locales);

        const tokens: Record<string, string | number> = {
            YYYY: formatNumber(parts.year, 4),
            YY: formatNumber(parts.year.substr(-2)),
            Y: parts.year,

            MMMM: long.month,
            MMM: short.month,
            MM: formatNumber(parts.month),
            M: parts.month,

            DDDD: long.weekday,
            DDD: short.weekday,
            DD: formatNumber(parts.day),
            D: parts.day,

            HH: formatNumber(parts.hour),
            H: parts.hour,

            hh: formatNumber(parts.hour),
            h: parts.hour,

            mm: formatNumber(parts.minute),
            m: parts.minute,

            sss: formatNumber(dt.ms, 3),
            ss: formatNumber(parts.second),
            s: parts.second,
        };

        const re = new RegExp(keysOf(tokens).join("|"), "g");

        return stringifyVar(mask).replace(re, (token) => stringifyVar(tokens[token]));
    }

    private static _getParts(date: DateTimeImmutable, type: "numeric" | "long" | "short", locale?: string | string[]) {
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

        if ("long" === type || "short" === type) {
            options.weekday = options.era = options.month = type;
        }
        if ("numeric" === type) {
            options.month = "numeric";
        }

        const formatter = new Intl.DateTimeFormat(locale, options);

        return this.formatToParts(date, formatter);
    }
}
