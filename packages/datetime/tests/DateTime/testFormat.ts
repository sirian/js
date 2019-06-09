import {DateTime} from "../../src";

const data: Array<[any, string]> = [
    ["", ""],
    [DateTime.formats.default, "2042-10-12 20:47:12"],
    [DateTime.formats.date, "2042-10-12"],
    [DateTime.formats.time, "20:47:12"],
    [DateTime.formats.iso, "2042-10-12T20:47:12Z"],
];

test.each(data)("DateTime.format(%o) === %o", (mask, expected) => {
    const str = "2042-10-12T20:47:12.456Z";
    const date = new DateTime(str);
    expect(date.format(mask)).toBe(expected);
});
