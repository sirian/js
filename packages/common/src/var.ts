import {AnyCtor, Ctor, Instance, Newable, Predicate, TypeGuard} from "@sirian/ts-extra-types";
import {
    getType,
    isArray,
    isFunction,
    isNumber,
    isNumberOrBigInt,
    isObject,
    isPrimitive,
    isString,
    isSymbol,
} from "./Is";
import {getObjectTag, getPrototype, hasMethod, tryCatch} from "./ref";

export const ifSatisfy = <T, P extends Predicate, O>(v: T, condition: P, otherwise?: O) =>
    (condition(v) ? v : otherwise) as
        P extends TypeGuard<infer U>
        ? (T extends U ? T : O)
        : T | O;

export const isConstructor = <T>(value: T): value is Extract<T, Newable> =>
    isFunction(value) && tryCatch(() => value === new (new Proxy(value, {
        construct: (target) => target,
    }) as any), false);

export const isInstanceOf = <C extends Array<AnyCtor | Newable>>(obj: any, ...ctor: C): obj is Instance<C[number]> =>
    ctor.some((c) => isFunction(c) && (obj instanceof c));

export const isEqualNaN = (value: any): value is number => value !== value;

export const ifEqualNaN = <T, U>(value: T, defaultValue: U) => isEqualNaN(value) ? defaultValue : value;

export const isSubclassOf = <A, B extends Ctor | NewableFunction>(a: A, b: B): a is Extract<A, B> =>
    isFunction(a) && (isEqual(a, b) || isInstanceOf(a.prototype, b));

export const isSameType = <T>(x: any, y: T): y is T =>
    x === y || null !== x && null !== y && getType(x) === getType(y);

export const isBetween = <T extends string | number | bigint>(x: T, min: T, max: T) =>
    isSameType(x, min) && isSameType(x, max) && x >= min && x <= max;

export const isArrayLike = (value: any): value is ArrayLike<any> => {
    if (isArray(value) || isString(value)) {
        return true;
    }
    if (!isObject(value)) {
        return false;
    }

    const length = value?.length;

    return isNumber(length) && !(length % 1) && length >= 0;
};

export const isPlain = (value: any) => isPlainArray(value) || isPlainObject(value);

export const isPlainArray = (value: any): value is unknown[] =>
    isArray(value) && isArray(getPrototype(value)) && !isArray(getPrototype(getPrototype(value)));

export const isAsyncIterable = (value: any): value is AsyncIterable<any> =>
    hasMethod(value, Symbol.asyncIterator);

export const isIterable = (value: any): value is Iterable<any> =>
    hasMethod(value, Symbol.iterator);

export const instanceOfGuard = <C extends Array<AnyCtor | Newable>>(...ctor: C) =>
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

export const compare = (x: any, y: any) => {
    const xNaN = x !== x;
    const yNaN = y !== y;

    if (x === y || xNaN && yNaN) {
        return 0;
    }


    if (!xNaN && !yNaN && isNumberOrBigInt(x) && isNumberOrBigInt(y) && x != y) { // use != to compare number/bigint
        return x < y ? -1 : 1;
    }

    const tx = typeof x;
    const ty = typeof y;

    if (tx !== ty) {
        return tx < ty ? -1 : 1;
    }

    return xNaN ? 1 :
           yNaN ? -1 :
           x < y ? -1 : 1;
};

export const isError = (value: any): value is Error => isInstanceOf(value, Error);

export const toPrimitive = (input: any, hint: "string" | "number" | "default" = "default") => {
    if (isPrimitive(input)) {
        return input;
    }

    const exoticToPrim = input[Symbol.toPrimitive];

    if (isFunction(exoticToPrim)) {
        const result = exoticToPrim.call(input, hint);
        if (isPrimitive(result)) {
            return result;
        }

        throw new TypeError("Unable to convert exotic object to primitive");
    }

    if (hint === "default" && (isInstanceOf(input, Date) || isSymbol(input))) {
        hint = "string";
    }

    const methodNames = hint === "string" ? ["toString", "valueOf"] : ["valueOf", "toString"];

    for (const method of methodNames) {
        if (hasMethod(input, method)) {
            const result = input[method]();
            if (isPrimitive(result)) {
                return result;
            }
        }
    }

    throw new TypeError("No default value");
};
