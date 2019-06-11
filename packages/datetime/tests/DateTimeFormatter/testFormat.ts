import {DateTime, DateTimeFormatter} from "../../src";

const date = new DateTime("2009-08-02T12:34:56.078Z");

const data: Array<[string, string]> = [
    ["Y", "2009"],
    ["YY", "09"],
    ["YYYY", "2009"],
    ["M", "8"],
    ["MM", "08"],
    ["MMM", "Aug"],
    ["MMMM", "August"],
    ["D", "2"],
    ["DD", "02"],
    ["DDD", "Sun"],
    ["DDDD", "Sunday"],
    ["h", "12"],
    ["hh", "12"],
    ["m", "34"],
    ["mm", "34"],
    ["s", "56"],
    ["ss", "56"],
    ["sss", "078"],
];

test.each(data)("date.format(%o) === %o", (format, expected) => {
    expect(DateTimeFormatter.format(date, format, "en-US")).toBe(expected);
});
