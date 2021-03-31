import {DateTime} from "./DateTime";
import {IDateTimeInterval} from "./DateTimeInterval";

export class DateTimeModifier {
    public readonly pattern: string;
    protected queue: Array<(date: DateTime) => any> = [];

    protected modifiers: Record<string, (date: DateTime) => any> = {
        now: () => void 0,
        today: (d) => d.startOfDay(),
        yesterday: (d) => d.sub({days: 1}).startOfDay(),
        tomorrow: (d) => d.add({days: 1}).startOfDay(),
        start: (d) => d.startOfDay(),
        end: (d) => d.endOfDay(),
    };

    protected keys: Record<string, keyof IDateTimeInterval> = {
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

    constructor(pattern: string) {
        let index = 0;
        pattern = pattern.trim();
        this.pattern = pattern;
        while (index < pattern.length) {
            const match = this.parse(pattern.substr(index));

            if (!match) {
                throw new Error(`Could not parse pattern "${pattern}" at index ${index}`);
            }

            index += match[0].length;
        }
    }

    public static modify(date: DateTime, pattern: string) {
        const modifier = new DateTimeModifier(pattern);
        modifier.modify(date);
    }

    public modify(date: DateTime) {
        for (const fn of this.queue) {
            fn(date);
        }
        return date;
    }

    protected parse(pattern: string) {
        let match = pattern.match(/^\s*(now|today|yesterday|tomorrow|start|end)/i);

        if (match) {
            this.queue.push(this.modifiers[match[1]]);
            return match;
        }

        match = pattern.match(/^\s*([+-])\s*(\d+)\s*(year|month|day|hour|minute|min|seconds|sec|ms)s?/i);

        if (match) {
            const [/*text*/, sign, val, type] = match;
            const mul = sign === "+" ? 1 : -1;
            const value = +val * mul;
            const key = this.keys[type.toLowerCase()];
            const interval = {[key]: value};
            this.queue.push((d) => d.add(interval));
            return match;
        }
    }
}
