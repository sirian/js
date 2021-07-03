import {DateArg, DateTime} from "../../src";

const data: Array<[DateArg, number]> = [
    ["", NaN],
    [0, 0],
    [1, 1],
    ["0", -62_167_219_200_000],
    ["1", -62_135_596_800_000],

];

test.each(data)("DateTime.from(%o) === %o", (value, expected) => {
    const dt = new DateTime(value);
    expect(dt.timestampMs).toBe(expected);
});
