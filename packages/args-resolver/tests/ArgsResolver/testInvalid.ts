import {ArgResolveError, ArgsResolver} from "../../src";

test("Invalid constraint", () => {
    expect(() => ArgsResolver.test([], {x: 1} as any)).toThrow(ArgResolveError);
});
