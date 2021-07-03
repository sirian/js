import {AnyKey, ArrayRO, Ensure, Func0, Func1, Get, Newable, Nullish} from "@sirian/ts-extra-types";
import {noop} from "./Const";
import {isFunction, isNotNullish, isNullish, isObjectOrFunction, isPrimitive} from "./Is";
import {toObject} from "./Obj";
import {stringifyObj} from "./Stringify";

export type TypedPropertyDescriptorMap<U> = { [P in keyof U]: TypedPropertyDescriptor<U[P]> };

export interface ProtoChainOptions {
    self?: boolean;
    maxDepth?: number;
    stopAt?: object;
}

// eslint-disable-next-line @typescript-eslint/unbound-method
const nativeCall = noop.call as any;
// eslint-disable-next-line @typescript-eslint/unbound-method
const nativeApply = noop.apply as any;
// eslint-disable-next-line @typescript-eslint/unbound-method
const nativeBind = noop.bind as any;

export const apply: {
    <R, A extends any[]>(target: (...args: A) => R, thisArg: any, args: A): R;
    <R>(target: () => R, thisArg?: any, args?: []): R
} = nativeCall.bind(nativeApply);

export const call = nativeCall.bind(nativeCall) as <R, A extends any[]>(target: (...args: A) => R, thisArg?: any, ...args: A) => R;

export const bind: {
    <R, A extends any[], B extends any[]>(f: (...args: [...A, ...B]) => R, thisArg: any, ...curry: A): (...args: B) => R;
} = nativeCall.bind(nativeBind);

export const getPrototype = (target: unknown) => isNullish(target) ? undefined : Object.getPrototypeOf(toObject(target));

export const getPrototypes = <T>(target: T, options: ProtoChainOptions = {}): Array<Partial<T>> => {
    const result = new Set<any>();
    const {maxDepth, stopAt, self = true} = options;

    let current: any = target;

    while (isNotNullish(current)) {
        if (maxDepth && result.size >= maxDepth || stopAt === current || result.has(current)) {
            break;
        }
        if (!isPrimitive(current)) {
            result.add(current);
        }
        current = getPrototype(current);
    }

    if (!self) {
        result.delete(target);
    }

    return [...result];
};

// eslint-disable-next-line unicorn/no-null
export const setPrototype = (target: object, proto: object | null | undefined) => Object.setPrototypeOf(target, proto ?? null);

export const hasPrototype = (target: any) => isNotNullish(getPrototype(target));

export const hasMethod = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K, Function> =>
    isFunction((target as any)?.[key]);

export const hasOwn = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> =>
    isNotNullish(target) && tryCatch(() => Object.prototype.hasOwnProperty.call(target, key), false);

export const getOwn = <T, K extends PropertyKey>(target: T, key: K) => hasOwn(target, key) ? target[key] : undefined;

export const ownKeys = <T>(target: T) =>
    isNullish(target) ? [] : [...ownNames(target), ...ownSymbols(target)] as Array<keyof T>;

export const ownSymbols = <S extends symbol>(target: any) =>
    isNullish(target) ? [] : Object.getOwnPropertySymbols(target);

export const ownNames = <T>(target: T) =>
    isNullish(target) ? [] : Object.getOwnPropertyNames(target) as Array<Extract<keyof T, string>>;

export const ownDescriptor: {
    <T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    (target: any, key: PropertyKey): PropertyDescriptor | undefined;
} = (target: any, key: PropertyKey) => isNullish(target) ? void 0 : Object.getOwnPropertyDescriptor(target, key);

export const getDescriptor: {
    <T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    (target: any, key: PropertyKey): PropertyDescriptor | undefined;
} = (target: any, key: PropertyKey) =>
    isNullish(target)
    ? void 0
    : ownDescriptor(target, key) ?? getDescriptor(getPrototype(target), key);

export const getDescriptors = <T>(target: T) => modify({}, (result: Record<any, any>) =>
    getPrototypes(target).forEach((obj) =>
        ownKeys(obj).forEach((key) =>
            result[key] ??= ownDescriptor(obj, key)))) as TypedPropertyDescriptorMap<T>;

export const ownDescriptors = <T>(target: T) => Object.getOwnPropertyDescriptors(target);

export const defineProp: {
    <T extends object, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): T;
    <T extends object>(t: T, k: PropertyKey, d: TypedPropertyDescriptor<any> | PropertyDescriptor): T;
} = (t: object, k: PropertyKey, d: PropertyDescriptor) => Object.defineProperty(t, k, d);

export const getConstructor = <T>(target: T) =>
    tryCatch(() => (target as any)?.constructor as Get<T, "constructor">);

export const applyIfFunction: {
    <A extends any[], R>(fn: (...args: A) => R, ...args: A): R;
    <T>(value: T, ...args: any[]): T;
} = (value: any, ...args: any[]) => isFunction(value) ? apply(value, void 0, args) : value;

export const construct: {
    <T>(constructor: { new(): T }, args?: [], newTarget?: Function): T;
    <A extends any[], T>(constructor: { new(...args: A): T }, args: A, newTarget?: Function): T;
    <T>(constructor: Newable<T>, args: any[], newTarget?: Function): T;
} = (target: any, args: any = [], newTarget?: Function) =>
    isNullish(newTarget) ? new target(...args) : Reflect.construct(target, args, newTarget);

export const hasProp = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> =>
    isNotNullish(target) && tryCatch(() => key in toObject(target), false);

export const hasAnyProp = <T, K extends PropertyKey>(target: T, keys: ArrayRO<K>): target is K extends any ? Ensure<T, K> : never =>
    keys.some((k) => hasProp(target, k));

export const getProp = <T, K extends AnyKey>(target: T, key: K) => (target as any)?.[key] as Get<T, K>;

export const setProp: {
    <T, K extends keyof T>(target: T, key: K, value: T[K]): boolean;
    <V, K extends PropertyKey>(target: { [P in K]: V }, key: K, value: V): boolean;
    (target: any, key: PropertyKey, value: any): boolean;
} = (target: any, key: PropertyKey, value: any) =>
    isObjectOrFunction(target) && tryCatch(() => (target as any)[key] = value, false);

export const deleteProp = <T, K extends keyof T>(target: T, key: K | PropertyKey) =>
    !isNullish(target) && tryCatch(() => delete (target as any)[key], false);

export const deleteProps = <T, K extends keyof T>(target: T | Nullish, ...keys: ArrayRO<K | PropertyKey>) =>
    modify(target, () => keys.forEach((key) => deleteProp(target, key))) as Omit<T, K>;

export const isPropWritable = (target: any, property: PropertyKey) => {
    if (isNullish(target)) {
        return false;
    }

    const desc = tryCatch(() => getDescriptor(target, property));
    if (!desc) {
        return isPrimitive(target) || Object.isExtensible(target);
    }

    return desc.writable || isFunction(desc.set);
};

export const tryCatch: {
    <T>(fn: () => T): T | undefined;
    <T, R>(fn: () => T, onError: R | Func1<R>): T | R;
} = <T, R>(fn: Func0, onError?: R | Func1<R>) => {
    try {
        return fn();
    } catch (error) {
        return applyIfFunction(onError, error);
    }
};

export const tryFinally = <T>(tryFn: () => T, finallyFn: () => void) => {
    try {
        return tryFn();
    } finally {
        finallyFn();
    }
};

export const tryCatchFinally = <T>(tryFn: () => T, catchFn: Func1, finallyFn: () => void) => {
    try {
        return tryFn();
    } catch {
        return applyIfFunction(catchFn);
    } finally {
        finallyFn();
    }
};

export const getObjectTag = (arg: any) => stringifyObj(arg).slice(8, -1);

// noinspection CommaExpressionJS
export const modify = <T>(value: T, cb: (v: T) => any) => (cb(value), value);
