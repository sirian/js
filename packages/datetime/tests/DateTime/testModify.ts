import {DateTime, DateTimeImmutable} from "../../src";

describe("", () => {
    const data: Array<[string, number]> = [
        ["", 0],
        ["+0sec", 0],
        ["+1sec", 1],
        ["+75sec", 75],
        ["+1minute", 60],
        ["+1hour", 3600],
        ["+1day", 86_400],
        ["+1day +1hour", 86_400 + 3600],
        ["+1day +2hour +3min +4sec", 86_400 + 2 * 3600 + 3 * 60 + 4],
    ];

    test.each(data)("date.modify(%o)", (value, expected) => {
        const d1 = new DateTimeImmutable("2019-01-01T08:34:00.000Z");
        const d2 = new DateTime(d1);

        expect(d1.timestampMs).toBe(d2.timestampMs);

        d2.modify(value);

        expect(d2.timestampMs - d1.timestampMs).toBe(expected * 1000);
    });
});
