import {XTypeName} from "@sirian/ts-extra-types";
import {getXType} from "../../src";

describe("Var.xtype", () => {
    const data: Array<[any, XTypeName]> = [
        [null, "null"],
        [undefined, "undefined"],
        [{}, "object"],
        [3, "number"],
        [true, "boolean"],
        [false, "boolean"],
        [3n, "bigint"],
        ["", "string"],
        [Symbol.iterator, "symbol"],
        [[1, 2], "array"],
        [new Uint8Array(), "object"],
    ];

    test.each(data)("Var.xtype(%o) === %o", (value, expected) => {
        expect(getXType(value)).toBe(expected);
    });
});
