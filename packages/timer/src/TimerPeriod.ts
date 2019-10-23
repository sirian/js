export class TimerPeriod {
    public readonly startAt: number;
    public readonly stopAt: number;
    public readonly duration: number;

    constructor(startAt: number, stopAt: number) {
        this.startAt = startAt;
        this.stopAt = stopAt;
        this.duration = stopAt - startAt;
    }
}
