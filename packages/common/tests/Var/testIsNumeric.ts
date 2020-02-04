import {isNumeric} from "../../src";

describe("", () => {
    const validData = ["-10",
        "0",
        "5",
        -16,
        0,
        -0,
        32,
        "-1.6",
        "4.536",
        -2.6,
        3.1415,
        1.5999999999999999,
        8e5,
        "123e-2",
        "040",
        "0xFF",
        "0Xba",
        0xFFF,
        "0b111110",
        "0B111110",
        "0o76",
        "0O76",
    ];

    const invalidData = [
        Object("42"),
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
        Object("Devo"),
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
    });
});
