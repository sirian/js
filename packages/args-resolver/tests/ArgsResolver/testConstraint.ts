import {isArray, isNumber, isString} from "@sirian/common";
import {Arg, ArgsResolver} from "../../src";

const data = [
    [Arg.Any, ["foo", "bar"], true],
    [[Arg.Any, isString], ["foo", "bar"], true],
    [[Arg.Any, isString], ["foo", 3], false],
    [[Arg.Any, isString], ["foo", "bar"], true],
    [[Arg.Any, isNumber], ["foo", "bar"], false],
    [[isString, isNumber], ["foo", "bar", ""], false],
    [[isString, isString], ["foo", "bar", ""], true],
    [[isString, isString, isNumber], ["foo", "bar", ""], false],
    [[isString, isString, isString], ["foo", "bar", ""], true],
    [[isString, isNumber, isString], ["foo", "bar", ""], false],
    [[isString, Arg.Any, isString], ["foo", "bar", ""], true],
    [[isString, isArray, isString], ["foo", "bar", ""], false],
    [[isString, Arg.Any, isNumber], ["foo", "bar", ""], false],
    [[isString, Arg.Any, isNumber], ["foo", "bar", 1], true],
] as Array<[any, any[], boolean]>;

test.each(data)("ArgsResolver.test(%O, %O) === %j", (constraint, args, expected) => {
    const result = ArgsResolver.test(args, constraint);
    expect(result).toBe(expected);
});
