import {stringifyVar} from "@sirian/common";
import {padN} from "./util";

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

        return Date.parse(this.normalizeISO(text));
    }

    public static normalizeISO(text: string) {
        const match = re.exec(stringifyVar(text || "").toUpperCase());

        if (!match) {
            return text;
        }

        const [/*text*/, year, month, day, hour, min, sec, ms, /*tzStr*/, tzSign, tzHour, tzMin] = match;

        const date = padN(year, 4) + "-" + padN(month ? +month : 1) + "-" + padN(+(day || 1));

        const time = padN(hour) + ":" + padN(min) + ":" + padN(sec);

        const tz = tzHour ? tzSign + padN(tzHour) + ":" + padN(tzMin) : "Z";

        const msTime = stringifyVar(ms || 0).padEnd(3, "0").substr(0, 3);

        return date + "T" + time + "." + msTime + tz;
    }
}
