import {isType} from "../../src";

describe("isType", () => {
    const trueData = [
        [3, "number", true],
        [3n, "bigint", true],
        ["", "string", true],
        ["3", "string", true],
        [null, "object", true],
        [undefined, "undefined", true],
        [{}, "object", true],
        [[], "object", true],
        [() => {}, "function", true],
    ] as const;

    const falseData = [
        [3, "string", false],
    ] as const;

    test.each([...trueData, ...falseData])("isType(%O, %O) === %O", (value, types, expected) => {
        expect(isType(value, types)).toBe(expected);
    });
});
