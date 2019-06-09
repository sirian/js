import {DateTime, DateTimeInterval, IDateInterval} from "../../src";

describe("", () => {
    const data: Array<[Partial<IDateInterval>, Partial<IDateInterval>?]> = [
        [{}],
        [{ms: 1}],
        [{seconds: 1}],
        [{seconds: 1, ms: 500}],
        [{minutes: 30}],
        [{months: 1}, {months: 1, days: 2}],
        [{months: 1, days: 2}, {months: 1, days: 4}],
        [{days: 2, months: 1}],
        [{days: 2, seconds: 1, ms: 500}],
    ];

    test.each(data)(`DateTime("2000-01-31T23:30:00Z").add(%p) === %p`, (i: Partial<IDateInterval>, expected = i) => {
        const d1 = new DateTime("2000-01-31T23:30:00Z");
        const d2 = DateTime.from(d1).add(i);

        const it = new DateTimeInterval(expected);

        expect(d1.diff(d2)).toStrictEqual(it);
        expect(d2.diff(d1)).toStrictEqual(new DateTimeInterval(it, true));
    });
});
