import {DateTime} from "../../src";

const now = new Date();
const validData: any[] = [
    undefined,
    null,
    123456789,
    now,
    now.getTime(),
    now.toISOString(),
    now.toUTCString(),
    now.toLocaleDateString(),
    now.toLocaleString(),
    now.toString(),
    now.toDateString(),
    now.toJSON(),
];

const invalidData: any[] = [
    "foo",
    "",
    +Infinity,
    "2000-20-20",
    "0000-00-00",
];

const data = [
    ...validData.map((v) => [v, true]),
    ...invalidData.map((v) => [v, false]),
];

test.each(data)("new DateTime(%o).isValid() === %o", (value, expected) => {
    const dt = new DateTime(value);
    expect(dt.isValid()).toBe(expected);
});
