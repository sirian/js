import {DateArg, DateTime} from "../../src";

const data: Array<[DateArg, string]> = [
    ["2017", "2017-01-01T00:00:00.000Z"],
    ["2017-10", "2017-10-01T00:00:00.000Z"],
    ["2017-10-2", "2017-10-02T00:00:00.000Z"],
    ["2017-3-2", "2017-03-02T00:00:00.000Z"],
    ["2017-3-20", "2017-03-20T00:00:00.000Z"],
    ["2017-3-20 11:00", "2017-03-20T11:00:00.000Z"],
    ["2017-3-20 11:3:25.3", "2017-03-20T11:03:25.300Z"],
    ["2017-1-1", "2017-01-01T00:00:00.000Z"],
    [0, "1970-01-01T00:00:00.000Z"],
    ["1", "0001-01-01T00:00:00.000Z"],
    [1, "1970-01-01T00:00:00.001Z"],
    ["2017-01-01T00:00:00.000Z", "2017-01-01T00:00:00.000Z"],
];

test.each(data)("DateTime.from(%o) === %o", (value, expected) => {
    const date = new Date(expected);
    const ts = date.getTime();
    const dt = new DateTime(value);

    expect(DateTime.create(expected).timestampMs).toBe(ts);
    expect(DateTime.create(date).timestampMs).toBe(ts);
    expect(DateTime.create(dt).timestampMs).toBe(ts);
    expect(DateTime.create(dt.toString()).timestampMs).toBe(ts);
    expect(DateTime.create(dt.timestampMs).timestampMs).toBe(ts);
    expect(DateTime.create(ts).timestampMs).toBe(ts);
    expect(dt.year).toBe(date.getUTCFullYear());
    expect(dt.month).toBe(date.getUTCMonth() + 1);
    expect(dt.day).toBe(date.getUTCDate());
    expect(dt.hour).toBe(date.getUTCHours());
    expect(dt.minute).toBe(date.getUTCMinutes());
    expect(dt.second).toBe(date.getUTCSeconds());
    expect(dt.ms).toBe(date.getUTCMilliseconds());
});
