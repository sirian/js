import {DateTime} from "../../src";
import {DateFormat} from "../../src/DateFormat";

const data: Array<[any, string]> = [
    ["", ""],
    [DateFormat.DEFAULT, "2042-10-12 20:47:12"],
    [DateFormat.DATE, "2042-10-12"],
    [DateFormat.TIME, "20:47:12"],
    [DateFormat.ISO, "2042-10-12T20:47:12Z"],
];

test.each(data)("DateTime.format(%o) === %o", (mask, expected) => {
    const str = "2042-10-12T20:47:12.456Z";
    const date = new DateTime(str);
    expect(date.format(mask)).toBe(expected);
});
