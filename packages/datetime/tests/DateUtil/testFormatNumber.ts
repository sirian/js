import {padN} from "../../src/util";

const data: Array<[string, any, string]> = [
    ["", undefined, "00"],
    ["", 0, ""],
    ["", 1, "0"],
    ["", 2, "00"],
    ["", 3, "000"],
    ["", 4, "0000"],

    ["5", undefined, "05"],
    ["5", 0, ""],
    ["5", 1, "5"],
    ["5", 2, "05"],
    ["5", 3, "005"],
    ["5", 4, "0005"],

    ["24", undefined, "24"],
    ["24", 0, ""],
    ["24", 1, "2"],
    ["24", 2, "24"],
    ["24", 3, "024"],
    ["24", 4, "0024"],

    ["567", undefined, "56"],
    ["567", 0, ""],
    ["567", 1, "5"],
    ["567", 2, "56"],
    ["567", 3, "567"],
    ["567", 4, "0567"],
];

test.each(data)("DateTimeFormatter.pad(%o, %o) === %o", (value, pad, expected) => {
    expect(padN(value, pad)).toBe(expected);
});
