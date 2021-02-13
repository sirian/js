import {
    AnyFunc,
    Ctor,
    ExtractByObjectTag,
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
import {getObjectTag} from "./Obj";
import {getPrototype, hasMethod, hasProp} from "./Ref";
import {stringifyObj} from "./Stringify";

export const isNull = (value: any): value is null => null === value;

export const isUndefined = (value: any): value is undefined => undefined === value;

export const isNullish = (value: any): value is Nullish => null == value;

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

export const isXType = <V, T extends XTypeName>(v: V, types: T | T[]): v is ExtractByXTypeName<V, T> =>
    isArray(types) ? isSome(getXType(v), types) : getXType<any>(v) === types;

export const isType = <V, T extends TypeName>(v: V, types: T | T[]): v is ExtractByTypeName<V, T> =>
    isArray(types) ? isSome(typeof v, types) : typeof v === types;

export const isSome = <U>(value: any, values: U[]): value is U => values.includes(value);

export const isNumber = (value: any): value is number => isType(value, "number");

export const isBigInt = (value: any): value is bigint => isType(value, "bigint");

export const isBoolean = (value: any): value is boolean => isType(value, "boolean");

export const isString = (value: any): value is string => isType(value, "string");

export const isSymbol = (value: any): value is symbol => isType(value, "symbol");

export const isFunction = <T extends any>(value: T): value is Function & Extract<T, AnyFunc> => isType(value, "function");

export const isPrimitive = (value: any): value is Primitive => !isObjectOrFunction(value);

export const isPropertyKey = (value: any): value is PropertyKey => isType(value, ["string", "number", "symbol"]);

export const ifSatisfy = <T, P extends Predicate, O>(v: T, condition: P, otherwise?: O) =>
    (condition(v) ? v : otherwise) as P extends TypeGuard<infer U>
                                      ? (T extends U ? T : O)
                                      : T | O;

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

export const isTruthy = (a: any) => !!a;

export const isFalsy = (a: any) => !a;

export const isObject = <T>(value: T): value is Exclude<Extract<T, object>, AnyFunc> =>
    null !== value && isType(value, "object");

export const isNumeric = (value: any): value is string | number =>
    isType(value, ["number", "string"]) && !isEqualNaN(value - parseFloat(value));

export const isPromiseLike = (value: any): value is PromiseLike<any> =>
    hasMethod(value, "then");

export const isObjectOrFunction = (value: any): value is object =>
    isObject(value) || isFunction(value);

export const isInstanceOf = <C extends Array<Ctor | Newable>>(obj: any, ...ctor: C): obj is Instance<C[number]> =>
    ctor.some((c) => isFunction(c) && (obj instanceof c));

export const isEqualNaN = (value: any): value is number => value !== value;

export const isEqualTuple = <T extends any[]>(x: T, y: any[]) => {
    if (!isArray(x) || !isArray(y)) {
        return false;
    }
    if (x.length !== y.length) {
        return false;
    }
    return x.every((v, i) => isEqual(v, y[i]));
};

export const isSubclassOf = <A, B extends Ctor | NewableFunction>(a: A, b: B): a is Extract<A, B> =>
    isFunction(a) && (isEqual(a, b) || isInstanceOf(a.prototype, b));

export const isSameType = <T>(x: any, value: T): value is T =>
    (x === null || value === null)
    ? x === value
    : typeof x === typeof value;

export const isBetween = <T extends string | number | bigint>(x: T, min: T, max: T) =>
    isSameType(x, min) && isSameType(x, max) && x >= min && x <= max;

export const isArray = (v: any): v is any[] => Array.isArray(v);

export const isArrayLike = (value: any, strict: boolean = true): value is ArrayLike<any> => {
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

export const isPlain = (value: any) => isPlainArray(value) || isPlainObject(value);

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

export const isAsyncIterable = (value: any): value is AsyncIterable<any> =>
    hasMethod(value, Symbol.asyncIterator);

export const isIterable = (value: any): value is Iterable<any> =>
    hasMethod(value, Symbol.iterator);

export const instanceOfGuard = <C extends Array<Ctor | Newable>>(...ctor: C) =>
    (value: any): value is Instance<C[number]> => isInstanceOf(value, ...ctor);

export const isRegExp = (value: any): value is RegExp => isInstanceOf(value, RegExp);
export const isArrayBuffer = (value: any): value is ArrayBuffer => isInstanceOf(value, ArrayBuffer);
export const isArrayBufferView = (v: any): v is ArrayBufferView => ArrayBuffer.isView(v);

export const isArrayBufferLike = (arg: any): arg is ArrayBufferLike =>
    isObject(arg) && isNumber(arg.byteLength) && isFunction(arg.slice);

export const isEqual = (x: any, y: any) =>
    x === y || isEqualNaN(x) && isEqualNaN(y);

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

export const isObjectTag = <O, T extends string>(obj: O, tag: T): obj is ExtractByObjectTag<O, T> =>
    tag === getObjectTag(obj);

export const stringifyVar = (value: any) => isNullish(value) || isSymbol(value) ? "" : "" + value;

export const Var = {
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
