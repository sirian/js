import {
    AnyFunc,
    Coalesce,
    Ctor,
    ExtractByTypeName,
    ExtractByXTypeName,
    Instance,
    Newable,
    Nullish,
    Predicate,
    Primitive,
    TypeGuard,
    TypeName,
    XTypeName,
    XTypeNameOf,
} from "@sirian/ts-extra-types";
import {getPrototype, hasMethod, hasProp} from "./Ref";
import {stringifyObj, stringifyVar} from "./Stringify";

export const ifSatisfy = <T, P extends Predicate, O>(v: T, condition: P, otherwise?: O) =>
    (condition(v) ? v : otherwise) as P extends TypeGuard<infer U>
                                      ? (T extends U ? T : O)
                                      : T | O;

export const isNull = (value: any): value is null =>
    null === value;

export const isUndefined = (value: any): value is undefined =>
    undefined === value;

export const isNullish = (value: any): value is Nullish =>
    null === value || undefined === value;

export const isNotNullish = <T>(value: T): value is Exclude<T, Nullish> => !isNullish(value);

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

export const isNumber = (value: any): value is number => isType(value, "number");

export const isBigInt = (value: any): value is bigint => isType(value, "bigint");

export const isBoolean = (value: any): value is boolean => isType(value, "boolean");

export const isString = (value: any): value is string => isType(value, "string");

export const isPropertyKey = (value: any): value is PropertyKey => isType(value, ["string", "number", "symbol"]);

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

    const p: any = new Proxy(value, {
        construct: (target) => target,
    });

    try {
        return value === new p();
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
    return hasMethod(value, "then");
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
    if (!isObject(value) || !hasProp(value, "length")) {
        return false;
    }

    const length = value.length;

    if (!strict) {
        return isNumeric(length);
    }

    return isNumber(length) && !(length % 1) && length >= 0;
};

export const isPlain = (value: any) => {
    return isPlainArray(value) || isPlainObject(value);
};

export const isPlainArray = (value: any): value is unknown[] => {
    if (!isArray(value)) {
        return false;
    }

    const proto = getPrototype(value);

    if (!isArray(proto)) {
        return false;
    }

    const nextProto = getPrototype(proto);

    return !isArray(nextProto);
};

export const isRegExp = (value: any): value is RegExp => {
    return isInstanceOf(value, RegExp);
};

export const isAsyncIterable = (value: any): value is AsyncIterable<any> => {
    return hasMethod(value, Symbol.asyncIterator);
};

export const isIterable = (value: any): value is Iterable<any> => {
    return hasMethod(value, Symbol.iterator);
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

    const prototype = getPrototype(x);

    if (!prototype || stringifyObj(x) !== "[object Object]") {
        return !prototype;
    }

    if (prototype !== Object.prototype) {
        return false;
    }

    const ctor = x.constructor;

    return !isFunction(ctor) || ctor.prototype !== x;
};

export const coalesce = <T extends any[]>(...values: T): Coalesce<T> => values.find(isNotNullish) ?? values.pop();

export const Var = {
    /** @deprecated use coalesce */
    coalesce,

    /** @deprecated use isNull */
    isNull,

    /** @deprecated use isUndefined */
    isUndefined,

    /** @deprecated use isNullish */
    isNullable: isNullish,

    /** @deprecated use getXType */
    getXType,

    /** @deprecated use isXType */
    isXType,

    /** @deprecated use isType */
    isType,

    /** @deprecated use isSome */
    isSome,

    /** @deprecated use isNumber */
    isNumber,

    /** @deprecated use isBigInt */
    isBigInt,

    /** @deprecated use isBoolean */
    isBoolean,

    /** @deprecated use isString */
    isString,

    /** @deprecated use isPropertyKey */
    isPropertyKey,

    /** @deprecated use isPrimitive */
    isPrimitive,

    /** @deprecated use isSymbol */
    isSymbol,

    /** @deprecated use isFunction */
    isFunction,

    /** @deprecated use isConstructor */
    isConstructor,

    /** @deprecated use isTruthy */
    isTruthy,

    /** @deprecated use isFalsy */
    isFalsy,

    /** @deprecated use isObject */
    isObject,

    /** @deprecated use isNumeric */
    isNumeric,

    /** @deprecated use isPromiseLike */
    isPromiseLike,

    /** @deprecated use isObjectOrFunction */
    isObjectOrFunction,

    /** @deprecated use isInstanceOf */
    isInstanceOf,

    /** @deprecated use isEqualNaN */
    isEqualNaN,

    /** @deprecated use isSubclassOf */
    isSubclassOf,

    /** @deprecated use isSameType */
    isSameType,

    /** @deprecated use isBetween */
    isBetween,

    /** @deprecated use isArray */
    isArray,

    /** @deprecated use isArrayLike */
    isArrayLike,

    /** @deprecated use isPlain */
    isPlain,

    /** @deprecated use isPlainArray */
    isPlainArray,

    /** @deprecated use isRegExp */
    isRegExp,

    /** @deprecated use isAsyncIterable */
    isAsyncIterable,

    /** @deprecated use isIterable */
    isIterable,

    /** @deprecated use isEqual */
    isEqual,

    /** @deprecated use isPlainObject */
    isPlainObject,

    /** @deprecated use stringifyVar */
    stringify: stringifyVar,
};
