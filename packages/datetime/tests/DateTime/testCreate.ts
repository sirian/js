import {DateTime} from "../../src";

describe("newe DateTime()", () => {
    const now = new Date();

    const data: Array<[any]> = [
        ["Mon, 03 Jul 2006 21:44:38 GMT"],
        ["2006-07-03T21:44:38.000Z"],
        ["2006-07-03T21:44:38.001Z"],
        ["2006-07-03T21:44:38.01Z"],
        ["2006-07-03T21:44:38.1Z"],
        ["2006-07-03T21:44:38.12Z"],
        [0],
        [1_234_567_890],
        [now],
        [now.getTime()],
        [now.toISOString()],
        [now.toUTCString()],
        [now.toLocaleString()],
    ];

    test.each(data)("DateTime.from(%o)", (value) => {
        const expected = new Date(value).toISOString();
        const dt = new DateTime(value);
        expect(dt.toString()).toBe(expected);
        expect(DateTime.create(value).toString()).toBe(expected);
    });
});
