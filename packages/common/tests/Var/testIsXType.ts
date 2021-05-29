import {XTypeName} from "@sirian/ts-extra-types";
import {isXType} from "../../src";
import {TestUtil} from "../TestUtil";

describe("Var.isXType", () => {
    const trueData: Array<[any, XTypeName]> = [
        [3, "number"],
        [3n, "bigint"],
        ["", "string"],
        ["3", "string"],
        [null, "null"],
        [undefined, "undefined"],
        [{}, "object"],
        [[], "array"],
        [() => {}, "function"],
    ];

    const falseData: Array<[any, XTypeName]> = [
        [3, "string"],
        [null, "object"],
    ];

    const data = TestUtil.mergeData(trueData, falseData);

    test.each(data)("Var.isType(%O, %O) === %O", (value, types, expected) => {
        expect(isXType(value, types)).toBe(expected);
    });
});
