import {
    entriesOf,
    isBigInt,
    isBoolean,
    isFunction,
    isNumber,
    isObject,
    isString,
    isSymbol,
    isUndefined,
} from "@sirian/common";
import {TypeName} from "@sirian/ts-extra-types";
import {ArgResolver} from "../../src";

const data: Array<[string, TypeName]> = [
    ["{}", "object"],
    ["1", "number"],
    ["''", "string"],
    ["new Date()", "object"],
    ["undefined", "undefined"],
    ["true", "boolean"],
    ["false", "boolean"],
    ["Boolean(1)", "boolean"],
    ["new Boolean(1)", "object"],
    ["Symbol.iterator", "symbol"],
];

test.each(data)("ArgResolver.resolve(%s) to %s", (code, typeName) => {
    const value = new Function(`return (${code})`)();

    const resolver = ArgResolver.switch(value);

    const typeConstraints = {
        bigint: isBigInt,
        boolean: isBoolean,
        function: isFunction,
        number: isNumber,
        object: isObject,
        string: isString,
        symbol: isSymbol,
        undefined: isUndefined,
    };

    for (const [type, constraint] of entriesOf(typeConstraints)) {
        resolver.when(constraint, () => type);
    }
    expect(resolver.resolve()).toEqual(typeName);
});
