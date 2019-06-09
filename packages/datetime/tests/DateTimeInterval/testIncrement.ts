import {DateTime, DateTimeInterval, DateTimePeriod, IDateInterval} from "../../src";

const data: Array<[Partial<IDateInterval>, number]> = [
    [{days: 1}, 2],
    [{days: 1, minutes: 1}, 1],
    [{hours: 1}, 25],
    [{minutes: 30}, 49],
    [{minutes: 60}, 25],
    [{minutes: 120}, 13],
];

test.each(data)("%p", (interval, expectedCount) => {
    const start = new DateTime("2000-01-01T00:00:00Z");
    const end = new DateTime("2000-01-02T00:00:00Z");

    const period = new DateTimePeriod({
        start,
        end,
        interval,
    });

    const revInterval = new DateTimeInterval(interval, true);

    const revPeriod = new DateTimePeriod({
        start: end,
        end: start,
        interval: revInterval,
    });

    expect(period.count()).toBe(expectedCount);
    expect(revPeriod.count()).toBe(expectedCount);

    const dates = [...period];
    const revDates = [...revPeriod];

    expect(dates).toHaveLength(expectedCount);
    expect(revDates).toHaveLength(expectedCount);

    expect(dates[0].timestampMs).toBe(start.timestampMs);
    expect(revDates[0].timestampMs).toBe(end.timestampMs);
});
