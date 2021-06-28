import {isNumber, isString} from "@sirian/common";
import {ArgsResolver} from "../../src";

test("ArgResolver.resolve", () => {
    const args: [number | boolean, string] = [100, "foo"];

    const result = ArgsResolver
        .switch(args)
        .when([isNumber, isNumber], (x, y) => 1)
        .when([isNumber, isString], (x, y) => 3)
        .when([isNumber], (x, y) => 5)
        .resolve(() => 0);

    expect(result).toBe(3);
});
