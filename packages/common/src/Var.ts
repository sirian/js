import {
    AnyFunc,
    Ctor,
    ExtractByTypeName,
    ExtractByXTypeName,
    Instance,
    Newable,
    Primitive,
    TypeName,
    XTypeName,
    XTypeNameOf,
} from "@sirian/ts-extra-types";
import {Num} from "./Num";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Str} from "./Str";

export const isNull = (value: any): value is null => {
    return null === value;
};

export const isUndefined = (value: any): value is undefined => {
    return undefined === value;
};

export const isNullish = (value: any): value is null | undefined => null === value || undefined === value;

/** @deprecated */
export const isNullable = isNullish;

export const getXType = <T>(value: T): XTypeNameOf<T> => {
    if (null === value) {
        return "null" as XTypeNameOf<T>;
    }

    if (isArray(value)) {
        return "array" as XTypeNameOf<T>;
    }

    return typeof value as XTypeNameOf<T>;
};

export const isXType = <V, T extends XTypeName>(v: V, types: T | T[]): v is ExtractByXTypeName<V, T> => {
    const type: any = getXType(v);

    return isArray(types) ? isSome(type, types) : type === types;
};

export const isType = <V, T extends TypeName>(v: V, types: T | T[]): v is ExtractByTypeName<V, T> => {
    const type: any = typeof v;
    return isArray(types) ? isSome(type, types) : type === types;
};

export const isSome = <U>(value: any, values: U[]): value is U => {
    return values.includes(value);
};

export const isNumber = (value: any): value is number => {
    return "number" === typeof value;
};

export const isBigInt = (value: any): value is bigint => {
    return "bigint" === typeof value;
};

export const isBoolean = (value: any): value is boolean => {
    return "boolean" === typeof value;
};

export const isString = (value: any): value is string => {
    return "string" === typeof value;
};

export const isPropertyKey = (value: any): value is PropertyKey => {
    return isType(value, ["string", "number", "symbol"]);
};

export const isPrimitive = (value: any): value is Primitive => {
    return !isObjectOrFunction(value);
};

export const isSymbol = (value: any): value is symbol => {
    return "symbol" === typeof value;
};

export const isFunction = <T extends any>(value: T): value is Function & Extract<T, AnyFunc> => {
    return "function" === typeof value;
};

export const isConstructor = <T>(value: T): value is Extract<T, Newable> => {
    if (!isFunction(value)) {
        return false;
    }
    const p: any = new Proxy(value as any, {construct: () => ({})});

    try {
        return new p() && true;
    } catch (e) {
        return false;
    }
};

export const isTruthy = (a: any) => {
    return !!a;
};

export const isFalsy = (a: any) => {
    return !a;
};

export const isObject = <T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> => {
    return null !== value && "object" === typeof value;
};

export const isNumeric = (value: any): value is string | number => {
    return isType(value, ["number", "string"]) && !isEqualNaN(value - parseFloat(value));
};

export const isPromiseLike = (value: any): value is PromiseLike<any> => {
    return Ref.hasMethod(value, "then");
};

export const isObjectOrFunction = (value: any): value is object => {
    return isObject(value) || isFunction(value);
};

export const isInstanceOf = <C extends Ctor | Newable>(obj: any, ctor: C): obj is Instance<C> => {
    return isFunction(ctor) && (obj instanceof ctor);
};

export const isEqualNaN = (value: any): value is number => {
    return value !== value;
};

export const isSubclassOf = <A, B extends Ctor | NewableFunction>(a: A, b: B): a is Extract<A, B> => {
    return isFunction(a) && (isEqual(a, b) || isInstanceOf(a.prototype, b));
};

export const isSameType = <T>(x: any, value: T): value is T => {
    if (x === null || value === null) {
        return x === value;
    }
    return typeof x === typeof value;
};

export const isBetween = <T extends string | number | bigint>(x: T, min: T, max: T) => {
    if (!isSameType(x, min) || !isSameType(x, max)) {
        return false;
    }

    return x >= min && x <= max;
};

export const isArray = (value: any): value is any[] => {
    return Array.isArray(value);
};

export const isArrayLike = (value: any, strict: boolean = true): value is { length: number } => {
    if (isString(value)) {
        return true;
    }
    if (!isObject(value) || !Ref.has(value, "length")) {
        return false;
    }

    const length = value.length;

    if (!strict) {
        return isNumeric(length);
    }

    return Num.isInt(length) && length >= 0;
};

export const isPlain = (value: any) => {
    return isPlainArray(value) || isPlainObject(value);
};

export const isPlainArray = (value: any): value is unknown[] => {
    if (!isArray(value)) {
        return false;
    }

    const proto = Ref.getPrototype(value);

    if (!isArray(proto)) {
        return false;
    }

    const nextProto = Ref.getPrototype(proto);

    return !isArray(nextProto);
};

export const isRegExp = (value: any): value is RegExp => {
    return isInstanceOf(value, RegExp);
};

export const stringify = (value: any) => {
    if (isNullish(value) || isSymbol(value)) {
        return "";
    }

    return Str.stringify(value);
};

export const isAsyncIterable = (value: any): value is AsyncIterable<any> => {
    return Ref.hasMethod(value, Symbol.asyncIterator);
};

export const isIterable = (value: any): value is Iterable<any> => {
    return Ref.hasMethod(value, Symbol.iterator);
};

export const isEqual = (x: any, y: any) => {
    if (x === y) {
        return true;
    }

    return isEqualNaN(x) && isEqualNaN(y);
};

export const isPlainObject = (x: any) => {
    if (!isObject(x)) {
        return false;
    }
    const prototype = Ref.getPrototype(x);

    if (Obj.getStringTag(x) !== "Object") {
        return !prototype;
    }

    if (!prototype) {
        return true;
    }

    if (prototype !== Object.prototype) {
        return false;
    }

    const ctor = x.constructor;

    return !ctor || !isFunction(ctor) || ctor.prototype !== x;
};

export const coalesce = <T>(...values: T[]) => values.find((v) => null !== v && undefined !== v) as Exclude<T, null | undefined>;

export const Var = {
    coalesce,
    isNull,
    isUndefined,
    isNullable,
    isNullish,
    getXType,
    isXType,
    isType,
    isSome,
    isNumber,
    isBigInt,
    isBoolean,
    isString,
    isPropertyKey,
    isPrimitive,
    isSymbol,
    isFunction,
    isConstructor,
    isTruthy,
    isFalsy,
    isObject,
    isNumeric,
    isPromiseLike,
    isObjectOrFunction,
    isInstanceOf,
    isEqualNaN,
    isSubclassOf,
    isSameType,
    isBetween,
    isArray,
    isArrayLike,
    isPlain,
    isPlainArray,
    isRegExp,
    stringify,
    isAsyncIterable,
    isIterable,
    isEqual,
    isPlainObject,
};
