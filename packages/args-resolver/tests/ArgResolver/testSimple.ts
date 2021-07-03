import {isFunction, isNumber, isObject, isString, isSymbol} from "@sirian/common";
import {Arg, ArgConstraint, ArgResolver} from "../../src";

const data: Array<[ArgConstraint<any>, string, boolean]> = [
    [Arg.Any, "1", true],
    [Arg.Any, "null", true],
    [Arg.Any, "undefined", true],
    [Arg.Any, "NaN", true],
    [Arg.Any, "Symbol.toStringTag", true],

    [NaN, "NaN", true],
    [NaN, "1", false],
    [NaN, "new Number(NaN)", false],

    [isNumber, "NaN", true],
    [isNumber, "Infinity", true],
    [isNumber, "1", true],
    [isNumber, "new Number(1)", false],

    [true, "1", false],
    [true, "true", true],
    [true, "false", false],

    [false, "0", false],
    [false, "false", true],
    [false, "true", false],

    [isString, "1", false],
    [isSymbol, "1", false],

    [isString, `""`, true],
    [isString, "String('')", true],
    [isString, "String", false],
    [isObject, "null", false],
    [isObject, "1", false],
    [isObject, "Object(null)", true],
    [isObject, "undefined", false],
    [isObject, "({})", true],
    [isObject, "(function(){})", false],

    [isFunction, "1", false],
    [isFunction, "{}", false],
    [isFunction, "(function(){})", true],
    [isFunction, "Function", true],
    [isFunction, "null", false],
    [isFunction, "undefined", false],

    [Arg.InstanceOf(Date), "({})", false],
    [Arg.InstanceOf(Date), "new Date()", true],
];

test.each(data)("ArgsResolver.testConstraint(%O, %s) === %O", (predicate, argCode, expected) => {
    const arg = new Function(`return (${argCode})`)();
    const result = ArgResolver.test(arg, predicate);
    expect(result).toBe(expected);
});
