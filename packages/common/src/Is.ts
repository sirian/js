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

export const isNull = (value: unknown): value is null => null === value;
export const isUndefined = (value: unknown): value is undefined | void => undefined === value;
// eslint-disable-next-line unicorn/no-null
export const isNullish = (value: unknown): value is Nullish => null == value;
// eslint-disable-next-line unicorn/no-null
export const isNotNullish = <T>(value: T): value is Exclude<T, Nullish> => null != value;
export const getType = <T>(value: T) => typeof value as TypeNameOf<T>;
export const isSome = <U>(value: any, values: U[]): value is U => values.includes(value);
export const isArray = Array.isArray;
export const getXType = <T>(value: T) =>
    (null === value
     ? "null"
     : (isArray(value) ? "array" : getType(value))) as XTypeNameOf<T>;

export const isXType = <V, T extends XTypeName>(v: V, type: T): v is ExtractByXTypeName<V, T> =>
    type === getXType(v) as any;

export const isType = <V, T extends TypeName>(v: V, type: T): v is ExtractByTypeName<V, T> =>
    type === typeof v;

export const isNumberOrBigInt = (value: unknown): value is number | bigint => isNumber(value) || isBigInt(value);
export const isNumber = (value: unknown): value is number => isType(value, "number");
export const isBigInt = (value: unknown): value is bigint => isType(value, "bigint");
export const isBoolean = (value: unknown): value is boolean => isType(value, "boolean");
export const isString = (value: unknown): value is string => isType(value, "string");
export const isSymbol = (value: unknown): value is symbol => isType(value, "symbol");
export const isObject = <T>(value: T): value is Exclude<Extract<T & object, object>, AnyFunc> => null !== value && isType(value, "object");
export const isFunction = <T>(value: T): value is Function & Extract<T, AnyFunc> => isType(value, "function");

export const isObjectOrFunction = (value: unknown): value is object => null !== value && (isObject(value) || isFunction(value));
export const isPrimitive = (value: unknown): value is Primitive => null == value || !isObjectOrFunction(value);
export const isPropertyKey = (value: unknown): value is PropertyKey => isString(value) || isNumber(value) || isSymbol(value);
export const isTruthy = (a: unknown) => !!a;
export const isFalsy = (a: unknown) => !a;

export const isPromiseLike = (value: any): value is PromiseLike<unknown> => isFunction(value?.then);
export const castArray = <T>(value: T | ArrayRO<T>) =>
    [].concat(value as any) as T[];
