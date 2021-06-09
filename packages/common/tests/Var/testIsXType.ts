import {isXType} from "../../src";

describe("Var.isXType", () => {
    const trueData = [
        [3, "number", true],
        [3n, "bigint", true],
        ["", "string", true],
        ["3", "string", true],
        [null, "null", true],
        [undefined, "undefined", true],
        [{}, "object", true],
        [[], "array", true],
        [() => {}, "function", true],
    ] as const;

    const falseData = [
        [3, "string", false],
        [null, "object", false],
    ] as const;

    test.each([...trueData, ...falseData])("Var.isType(%O, %O) === %O", (value, types, expected) => {
        expect(isXType(value, types)).toBe(expected);
    });
});
