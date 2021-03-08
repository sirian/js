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
export const getXType = <T>(value: T) =>
    (null === value
     ? "null"
     : (isArray(value)
        ? "array"
        : getType(value))) as XTypeNameOf<T>;

export const isXType = <V, T extends XTypeName>(v: V, types: T | T[]): v is ExtractByXTypeName<V, T> =>
    ([] as any[]).concat(types).includes(getXType(v));

export const isType = <V, T extends TypeName>(v: V, types: T | T[]): v is ExtractByTypeName<V, T> =>
    ([] as any[]).concat(types).includes(getType(v));

export const isNumber = (value: any): value is number => isType(value, "number");
export const isBigInt = (value: any): value is bigint => isType(value, "bigint");
export const isBoolean = (value: any): value is boolean => isType(value, "boolean");
export const isString = (value: any): value is string => isType(value, "string");
export const isSymbol = (value: any): value is symbol => isType(value, "symbol");
export const isObject = <T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> => null !== value && isType(value, "object");
export const isFunction = <T extends any>(value: T): value is Function & Extract<T, AnyFunc> => isType(value, "function");

export const isObjectOrFunction = (value: any): value is object => isObject(value) || isFunction(value);
export const isPrimitive = (value: any): value is Primitive => !isObjectOrFunction(value);
export const isPropertyKey = (value: any): value is PropertyKey => isString(value) || isNumber(value) || isSymbol(value);
export const isTruthy = (a: any) => !!a;
export const isFalsy = (a: any) => !a;

export const isPromiseLike = (value: any): value is PromiseLike<any> => isFunction(value?.then);
