import {DateTimeFormatter} from "./DateTimeFormatter";

const opt = (value: string) => "(?:" + value + ")?";

const d12 = "([0-9]{1,2})";

const reDate = "([0-9]{1,4})" + opt("-" + d12) + opt("-" + d12);
const msPattern = "\\.([0-9]+)";
const reTime = d12 + ":" + d12 + opt(":" + d12 + opt(msPattern));
const reTimezone = "(?:Z|(?:GMT)?\s*([+-])?" + d12 + opt(":?" + d12) + ")";

const re = new RegExp([
    "^",
    reDate,
    opt("[ T]" + reTime),
    opt("\\s*" + reTimezone),
    "$",
].join(""), "i");

export class DateTimeParser {
    public static parse(text: string) {
        if ("now" === text.toLowerCase()) {
            return Date.now();
        }
        const str = this.normalizeISO(text);

        return Date.parse(str);
    }

    public static normalizeISO(text: string) {
        const match = String(text || "").toUpperCase().match(re);

        if (!match) {
            return text;
        }

        const pad = DateTimeFormatter.pad;

        const [/*text*/, year, month, day, hour, min, sec, ms, /*tzStr*/, tzSign, tzHour, tzMin] = match;

        // eval("console.log(text, {year, month, day, hour, min, sec, ms, tzStr, tzSign, tzHour, tzMin})");

        const date = [
            pad(year, 4),
            pad(month ? +month : 1),
            pad(day ? +day : 1),
        ].join("-");

        const time = [
            pad(hour),
            pad(min),
            pad(sec),
        ].join(":");

        const tz = tzHour ? tzSign + pad(tzHour) + ":" + pad(tzMin) : "Z";

        const msTime = String(ms || 0).padEnd(3, "0").substr(0, 3);

        return date + "T" + time + "." + msTime + tz;
    }
}
