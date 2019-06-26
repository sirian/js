import {Var} from "../../src";
import {Switch} from "../../src/Switch";

describe("Switch.resolve", () => {
    const data: Array<[any, any]> = [
        [3, "3"],
        [4, "number"],
        [5, "number"],
        [NaN, "number"],
        [true, "true"],
        ["foo", "foo"],
        ["bar", "default"],
        [false, "default"],
        [[3], "default"],
        [() => 1, "function_type"],
    ];

    test.skip.each(data)("Switch.resolve(%o) === %o", (value, expected) => {
        const result = Switch
            .switch(value)
            .eq(3, () => "3" as const)
            .eq(true, () => "true" as const)
            .case(Var.isNumber, () => "number" as const)
            .eq(4, () => "4" as const)
            .eq("foo", () => "foo" as const)
            .type("object", () => "object_type" as const)
            .resolve(() => "default" as const);

        expect(result).toBe(expected);
    });
});
