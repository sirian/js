import {Timer, TimerPeriod} from "../../src";

describe("Timer.lap", () => {
    jest.useFakeTimers();
    let now = 0;
    setInterval(() => ++now, 1);

    const timer = new Timer({
        now: () => now,
    });

    timer.start();
    setTimeout(() => timer.lap(), 100);
    setTimeout(() => timer.lap(), 500);
    setTimeout(() => timer.stop(), 1000);

    const runTimersToTime = (ms: number) => jest.advanceTimersByTime(ms - now);

    test("Timer.lap 0", () => {
        expect(timer.getDuration()).toStrictEqual(0);
        expect(timer.getPeriods()).toStrictEqual([]);
    });

    test("Timer.lap 50", () => {
        runTimersToTime(50);

        expect(now).toBe(50);
        expect(timer.getPeriods()).toStrictEqual([]);
        expect(timer.getDuration()).toStrictEqual(50);
    });

    test("Timer.lap 100", () => {
        runTimersToTime(100);

        expect(now).toBe(100);
        expect(timer.getDuration()).toStrictEqual(100);
        expect(timer.getPeriods()).toStrictEqual([new TimerPeriod(0, 100)]);
    });

    test("Timer.lap 500", () => {
        runTimersToTime(500);
        expect(timer.getDuration()).toStrictEqual(now);
        expect(timer.getPeriods()).toStrictEqual([
            new TimerPeriod(0, 100),
            new TimerPeriod(100, 500),
        ]);
    });

    test("Timer.lap 1000", () => {
        runTimersToTime(1000);
        expect(timer.getDuration()).toStrictEqual(1000);
        expect(timer.getPeriods()).toStrictEqual([
            new TimerPeriod(0, 100),
            new TimerPeriod(100, 500),
            new TimerPeriod(500, 1000),
        ]);
    });
});
