export interface IDateTimeInterval {
    years: number;
    months: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    ms: number;
}

export class DateTimeInterval implements IDateTimeInterval {
    public years: number = 0;
    public months: number = 0;
    public days: number = 0;
    public hours: number = 0;
    public minutes: number = 0;
    public seconds: number = 0;
    public ms: number = 0;

    constructor(interval: Partial<IDateTimeInterval> = {}, inverse: boolean = false) {
        const sign = inverse ? -1 : 1;
        this.years = sign * (interval.years ?? 0) || 0;
        this.months = sign * (interval.months ?? 0) || 0;
        this.days = sign * (interval.days ?? 0) || 0;
        this.hours = sign * (interval.hours ?? 0) || 0;
        this.minutes = sign * (interval.minutes ?? 0) || 0;
        this.seconds = sign * (interval.seconds ?? 0) || 0;
        this.ms = sign * (interval.ms ?? 0) || 0;
    }
}
