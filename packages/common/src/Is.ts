import {
    AnyFunc,
    ExtractByTypeName,
    ExtractByXTypeName,
    Nullish,
    Primitive,
    TypeName,
    TypeNameOf,
    XTypeName,
    XTypeNameOf,
} from "@sirian/ts-extra-types";

export const isNull = (value: any): value is null => null === value;
export const isUndefined = (value: any): value is undefined => undefined === value;
export const isNullish = (value: any): value is Nullish => null == value;
export const isNotNullish = <T>(value: T): value is Exclude<T, Nullish> => !isNullish(value);
export const getType = <T>(value: T) => typeof value as TypeNameOf<T>;
export const isSome = <U>(value: any, values: U[]): value is U => values.includes(value);
export const isArray = (v: any): v is any[] => Array.isArray(v);
export const getXType = <T>(value: T): XTypeNameOf<T> => {
    if (null === value) {
        return "null" as XTypeNameOf<T>;
    }

    if (isArray(value)) {
        return "array" as XTypeNameOf<T>;
    }

    return getType(value) as XTypeNameOf<T>;
};
export const isXType = <V, T extends XTypeName>(v: V, types: T | T[]): v is ExtractByXTypeName<V, T> =>
    isArray(types) ? isSome(getXType(v), types) : isXType(v, [types]);
export const isType = <V, T extends TypeName>(v: V, types: T | T[]): v is ExtractByTypeName<V, T> =>
    isArray(types) ? isSome(getType(v), types) : isType(v, [types]);
export const isNumber = (value: any): value is number => isType(value, "number");
export const isBigInt = (value: any): value is bigint => isType(value, "bigint");
export const isBoolean = (value: any): value is boolean => isType(value, "boolean");
export const isString = (value: any): value is string => isType(value, "string");
export const isSymbol = (value: any): value is symbol => isType(value, "symbol");
export const isFunction = <T extends any>(value: T): value is Function & Extract<T, AnyFunc> => isType(value, "function");
export const isObjectOrFunction = (value: any): value is object => isObject(value) || isFunction(value);
export const isPrimitive = (value: any): value is Primitive => !isObjectOrFunction(value);
export const isPropertyKey = (value: any): value is PropertyKey => isType(value, ["string", "number", "symbol"]);
export const isTruthy = (a: any) => !!a;
export const isFalsy = (a: any) => !a;
export const isObject = <T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> =>
    null !== value && isType(value, "object");