import {XTypeName} from "@sirian/ts-extra-types";
import {isXType} from "../../src";
import {Util} from "../Util";

describe("Var.isXType", () => {
    const trueData: Array<[any, XTypeName | XTypeName[]]> = [
        [3, "number"],
        [3, ["number"]],
        [3, ["string", "number"]],
        [null, ["null"]],
    ];

    const falseData: Array<[any, XTypeName | XTypeName[]]> = [
        [3, []],
        [3, ["string"]],
        [3, "string"],
        [null, ["object"]],
    ];

    const data = Util.mergeData(trueData, falseData, false);

    test.each(data)("Var.isType(%O, %O) === %O", (value, types, expected) => {
        expect(isXType(value, types)).toBe(expected);
    });
});
