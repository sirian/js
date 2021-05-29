import {TypeName} from "@sirian/ts-extra-types";
import {isType} from "../../src";
import {TestUtil} from "../TestUtil";

describe("Var.isType", () => {
    const trueData: Array<[any, TypeName]> = [
        [3, "number"],
        [3n, "bigint"],
        ["", "string"],
        ["3", "string"],
        [null, "object"],
        [undefined, "undefined"],
        [{}, "object"],
        [[], "object"],
        [() => {}, "function"],
    ];

    const falseData: Array<[any, TypeName]> = [
        [3, "string"],
    ];

    const data = TestUtil.mergeData(trueData, falseData);

    test.each(data)("Var.isType(%O, %O) === %O", (value, types, expected) => {
        expect(isType(value, types)).toBe(expected);
    });
});
