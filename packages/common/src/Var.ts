import {Ctor, Instance, Newable, Predicate, TypeGuard} from "@sirian/ts-extra-types";
import {isArray, isFunction, isNumber, isObject, isString, isType} from "./Is";
import {getObjectTag, getPrototype, hasMethod, tryCatch} from "./Ref";

export const ifSatisfy = <T, P extends Predicate, O>(v: T, condition: P, otherwise?: O) =>
    (condition(v) ? v : otherwise) as
        P extends TypeGuard<infer U>
        ? (T extends U ? T : O)
        : T | O;

export const isConstructor = <T>(value: T): value is Extract<T, Newable> =>
    isFunction(value) && tryCatch(() => value === new (new Proxy(value, {
        construct: (target) => target,
    }) as any), false);

export const isNumeric = (value: any): value is string | number =>
    isType(value, ["number", "string"]) && !isEqualNaN(value - parseFloat(value));

export const isInstanceOf = <C extends Array<Ctor | Newable>>(obj: any, ...ctor: C): obj is Instance<C[number]> =>
    ctor.some((c) => isFunction(c) && (obj instanceof c));

export const isEqualNaN = (value: any): value is number => value !== value;

export const ifEqualNaN = <T, U>(value: T, defaultValue: U) => isEqualNaN(value) ? defaultValue : value;

export const isSubclassOf = <A, B extends Ctor | NewableFunction>(a: A, b: B): a is Extract<A, B> =>
    isFunction(a) && (isEqual(a, b) || isInstanceOf(a.prototype, b));

export const isSameType = <T>(x: any, value: T): value is T =>
    (x === null || value === null)
    ? x === value
    : typeof x === typeof value;

export const isBetween = <T extends string | number | bigint>(x: T, min: T, max: T) =>
    isSameType(x, min) && isSameType(x, max) && x >= min && x <= max;

export const isArrayLike = (value: any, strict: boolean = true): value is ArrayLike<any> => {
    if (isString(value)) {
        return true;
    }
    if (!isObject(value)) {
        return false;
    }

    const length = value?.length;

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

export const isEqual = (x: any, y: any) => x === y || isEqualNaN(x) && isEqualNaN(y);

export const isPlainObject = (x: any) => {
    if (!isObject(x)) {
        return false;
    }

    const prototype = getPrototype(x);

    if (!prototype || getObjectTag(x) !== "Object") {
        return !prototype;
    }

    if (prototype !== Object.prototype) {
        return false;
    }

    const ctor = x.constructor;

    return !isFunction(ctor) || ctor.prototype !== x;
};

export const compare = (x: any, y: any): -1 | 0 | 1 =>
    isEqual(x, y) ? 0 : (isEqual(x, ([x, y].sort())[0]) ? -1 : 1);
