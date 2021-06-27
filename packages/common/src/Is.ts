import {
    AnyFunc,
    ArrayRO,
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
export const isUndefined = (value: any): value is undefined | void => undefined === value;
export const isNullish = (value: any): value is Nullish => null == value;
export const isNotNullish = <T>(value: T): value is Exclude<T, Nullish> => null != value;
export const getType = <T>(value: T) => typeof value as TypeNameOf<T>;
export const isSome = <U>(value: any, values: U[]): value is U => values.includes(value);
export const isArray = Array.isArray;
export const getXType: { <T>(value: T): XTypeNameOf<T> } = (value: any): any =>
    null === value
    ? "null"
    : (isArray(value) ? "array" : getType(value));

export const isXType = <V, T extends XTypeName>(v: V, type: T): v is ExtractByXTypeName<V, T> =>
    type === getXType(v) as any;

export const isType = <V, T extends TypeName>(v: V, type: T): v is ExtractByTypeName<V, T> =>
    type === typeof v;

export const isNumber = (value: any): value is number => isType(value, "number");
export const isBigInt = (value: any): value is bigint => isType(value, "bigint");
export const isBoolean = (value: any): value is boolean => isType(value, "boolean");
export const isString = (value: any): value is string => isType(value, "string");
export const isSymbol = (value: any): value is symbol => isType(value, "symbol");
export const isObject = <T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> => null !== value && isType(value, "object");
export const isFunction = <T>(value: T): value is Function & Extract<T, AnyFunc> => isType(value, "function");

export const isObjectOrFunction = (value: any): value is object => null !== value && (isObject(value) || isFunction(value));
export const isPrimitive = (value: any): value is Primitive => null == value || !isObjectOrFunction(value);
export const isPropertyKey = (value: any): value is PropertyKey => isString(value) || isNumber(value) || isSymbol(value);
export const isTruthy = (a: any) => !!a;
export const isFalsy = (a: any) => !a;

export const isPromiseLike = (value: any): value is PromiseLike<any> => isFunction(value?.then);
export const castArray = <T>(value: T | ArrayRO<T>) =>
    [].concat(value as any) as T[];
