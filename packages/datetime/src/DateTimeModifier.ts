import {assert, stringifyVar} from "@sirian/common";
import {DateTime} from "./DateTime";
import {IDateTimeInterval} from "./DateTimeInterval";

export class DateTimeModifier {
    private _queue: Array<(date: DateTime) => any> = [];

    private _modifiers: Record<string, (date: DateTime) => any> = {
        now: () => void 0,
        today: (d) => d.startOfDay(),
        yesterday: (d) => d.sub({days: 1}).startOfDay(),
        tomorrow: (d) => d.add({days: 1}).startOfDay(),
        start: (d) => d.startOfDay(),
        end: (d) => d.endOfDay(),
    };

    constructor(pattern: string) {
        pattern = stringifyVar(pattern).trim();

        for (let index = 0; index < pattern.length;) {
            const match = this._parse(pattern.slice(index));

            assert(match, "Could not parse pattern", {pattern, index});

            index += match[0].length;
        }
    }

    public static modify(date: DateTime, pattern: string) {
        const modifier = new DateTimeModifier(pattern);
        modifier.modify(date);
    }

    public modify(date: DateTime) {
        for (const fn of this._queue) {
            fn(date);
        }

        return date;
    }

    private _parse(pattern: string) {
        let match = /^\s*(now|today|yesterday|tomorrow|start|end)/i.exec(pattern);

        if (match) {
            this._queue.push(this._modifiers[match[1]]);
            return match;
        }

        match = /^\s*([+-])\s*(\d+)\s*(year|month|day|hour|minute|min|seconds|sec|ms)s?/i.exec(pattern);

        const keys: Record<string, keyof IDateTimeInterval> = {
            year: "years",
            month: "months",
            day: "days",
            hour: "hours",
            min: "minutes",
            minute: "minutes",
            sec: "seconds",
            second: "seconds",
            ms: "ms",
        };

        if (match) {
            const [/*text*/, sign, val, type] = match;
            const mul = sign === "+" ? 1 : -1;
            const value = +val * mul;
            const key = keys[type.toLowerCase()];
            const interval = {[key]: value};
            this._queue.push((d) => d.add(interval));
            return match;
        }
    }
}
