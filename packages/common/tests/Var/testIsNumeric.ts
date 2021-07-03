/* eslint-disable unicorn/no-null */
import {isNumber, isNumeric, stringifyVar, toObject} from "../../src";

describe("", () => {
    const validData = [
        "-10",
        "0",
        "-0",
        "5",
        -16,
        0,
        -0,
        32,
        "-1.6",
        "4.536",
        -2.6,
        3.1415,
        1.599_999_999_999_999_9,
        8e5,
        ".123e-2",
        "040",
        "0xFF",
        "0Xba",
        0xF_FF,
        "0b111110",
        "0B111110",
        "0o76",
        "0O76",
    ];

    const invalidData = [
        0n,
        1n,
        -1n,
        toObject("42"),
        "",
        "        ",
        "\t\t",
        "abcdefghijklm1234567890",
        "xabcdefx",
        true,
        false,
        "bcfed5.2",
        "7.2acdgs",
        undefined,
        null,
        NaN,
        Infinity,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        toObject("Devo"),
        {},
        [],
        [0],
        [""],
        [42],
        () => 1,
        new Date(),
    ];

    const data = [
        ...validData.map((v) => [v, true]),
        ...invalidData.map((v) => [v, false]),
    ];

    test.each(data)("Var.isNumeric(%o) === %o", (value, expected) => {
        expect(isNumeric(value)).toBe(expected);
        if (isNumber(value)) {
            expect(isNumeric(stringifyVar(value))).toBe(expected);
        }
    });
});
