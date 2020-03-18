import {TypeName} from "@sirian/ts-extra-types";
import {isType} from "../../src";
import {TestUtil} from "../TestUtil";

describe("Var.isType", () => {
    const trueData: Array<[any, TypeName | TypeName[]]> = [
        [3, "number"],
        [3, ["number"]],
        [3, ["string", "number"]],
        [null, "object"],
        [null, ["object"]],
    ];

    const falseData: Array<[any, TypeName | TypeName[]]> = [
        [3, []],
        [3, ["string"]],
        [3, "string"],
    ];

    const data = TestUtil.mergeData(trueData, falseData, false);

    test.each(data)("Var.isType(%O, %O) === %O", (value, types, expected) => {
        expect(isType(value, types)).toBe(expected);
    });
});
