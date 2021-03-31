import {DateTime, DateTimeInterval, DateTimePeriod, IDateTimeInterval} from "../../src";

const data: Array<[Partial<IDateTimeInterval>, number]> = [
    [{days: 1}, 2],
    [{days: 1, minutes: 1}, 1],
    [{hours: 1}, 5],
    [{minutes: 30}, 5],
    [{minutes: 60}, 5],
    [{minutes: 120}, 5],
];

test.each(data)("%p", (interval, expected) => {
    const start = new DateTime("2000-01-01T00:00:00Z");
    const end = new DateTime("2000-01-02T00:00:00Z");

    const period = new DateTimePeriod({
        start,
        end,
        interval,
        limit: 5,
    });

    const revInterval = new DateTimeInterval(interval, true);

    const revPeriod = new DateTimePeriod({
        start: end,
        end: start,
        interval: revInterval,
        limit: 5,
    });

    expect(period.count()).toBe(expected);
    expect(revPeriod.count()).toBe(expected);

    const dates = [...period];
    const revDates = [...revPeriod];

    expect(dates).toHaveLength(expected);
    expect(revDates).toHaveLength(expected);

    expect(dates[0].timestampMs).toBe(start.timestampMs);
    expect(revDates[0].timestampMs).toBe(end.timestampMs);
});
