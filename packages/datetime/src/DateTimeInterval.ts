import {entriesOf} from "@sirian/common";

export interface IDateInterval {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ms: number;
}

export class DateTimeInterval implements IDateInterval {
    public years!: number;
    public months!: number;
    public days!: number;
    public hours!: number;
    public minutes!: number;
    public seconds!: number;
    public ms!: number;

    constructor(interval: Partial<IDateInterval> = {}, inverse: boolean = false) {
        const keys = new Set<keyof IDateInterval>([
            "years",
            "months",
            "days",
            "hours",
            "minutes",
            "seconds",
            "ms",
        ]);

        for (const [key, value] of entriesOf(interval)) {
            if (!value || !keys.has(key)) {
                continue;
            }
            if (keys.delete(key) && value) {
                this[key] = +value * (inverse ? -1 : 1);
            }
        }

        for (const key of keys) {
            this[key] = 0;
        }
    }
}
