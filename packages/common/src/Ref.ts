import {AnyKey, ArrayRO, Ensure, Func, Func0, Func1, Get, Newable} from "@sirian/ts-extra-types";
import {isFunction, isNotNullish, isNullish, isObjectOrFunction, isPrimitive, isString, isSymbol} from "./Is";
import {stringifyObj} from "./Stringify";

export type TypedPropertyDescriptorMap<U> = { [P in keyof U]: TypedPropertyDescriptor<U[P]> };

export interface ProtoChainOptions {
    self?: boolean;
    maxDepth?: number;
    stopAt?: object;
}

export const getPrototype = (target: any) => isNullish(target) ? undefined : Reflect.getPrototypeOf(Object(target));

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

export const setPrototype = (target: object, proto: object | null | undefined) => Reflect.setPrototypeOf(target, proto ?? null);

export const hasMethod = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K, Function> =>
    isFunction((target as any)?.[key]);

export const hasOwn = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> =>
    isNotNullish(target) && Object.prototype.hasOwnProperty.call(target, key);

export const ownKeys = <T>(target: T) =>
    (isObjectOrFunction(target) ? Reflect.ownKeys(target) : []) as Array<keyof T>;

export const ownSymbols = <S extends symbol>(target: { [P in S]: any }) =>
    ownKeys(target).filter(isSymbol);

export const ownNames = <T>(target: T) =>
    ownKeys(target).filter(isString) as Array<Extract<keyof T, string>>;

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

export const getDescriptors = <T>(target: T) => {
    const result: Record<any, any> = {};

    for (const obj of getPrototypes(target)) {
        for (const key of ownKeys(obj)) {
            result[key] ||= ownDescriptor(obj, key);
        }
    }
    return result as TypedPropertyDescriptorMap<T>;
};

export const ownDescriptors = <T>(target: T) => Object.getOwnPropertyDescriptors(target);

export const defineProp: {
    <T, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): boolean;
    (t: object, k: PropertyKey, d: TypedPropertyDescriptor<any> | PropertyDescriptor): boolean;
} = (t: object, k: PropertyKey, d: PropertyDescriptor) => Reflect.defineProperty(t, k, d);

export const getConstructor = <T extends any>(target: T): Newable<T> | undefined => (target as any)?.constructor;

export const apply: {
    <R, A extends any[]>(target: (...args: A) => R, thisArg: any, args: A): R;
    <R>(target: () => R, thisArg?: any, args?: []): R
} = ((target: Func, thisArg?: any, args: any[] = []) =>
    target.apply(thisArg, args));

export const applyIfFunction: {
    <A extends any[], R>(fn: (...args: A) => R, ...args: A): R;
    <T>(value: T, ...args: any[]): T;
} = (value: any, ...args: any[]) => isFunction(value) ? apply(value, null, args) : value;

export const call = <R, A extends any[]>(target: (...args: A) => R, thisArg?: any, ...args: A): R =>
    target.call(thisArg, ...args);

export const construct: {
    <T>(constructor: { new(): T }, args?: [], newTarget?: Function): T;
    <A extends any[], T>(constructor: { new(...args: A): T }, args: A, newTarget?: Function): T;
    <T>(constructor: Newable<T>, args: any[], newTarget?: Function): T;
} = (target: any, args: any = [], newTarget?: Function) =>
    isNullish(newTarget) ? new target(...args) : Reflect.construct(target, args, newTarget);

export const hasProp = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> =>
    isNotNullish(target) && (key in Object(target));

export const hasAnyProp = <T, K extends PropertyKey>(target: T, keys: ArrayRO<K>): target is Ensure<T, K> =>
    keys.some((k) => hasProp(target, k));

export const getProp = <T, K extends AnyKey>(target: T, key: K) => (target as any)?.[key] as Get<T, K>;

export const setProp: {
    <T, K extends keyof T>(target: T, key: K, value: T[K]): boolean;
    <V, K extends PropertyKey>(target: { [P in K]: V }, key: K, value: V): boolean;
    (target: any, key: PropertyKey, value: any): boolean;
} = (target: any, key: PropertyKey, value: any) =>
    isObjectOrFunction(target) && Reflect.set(target, key, value);

export const deleteProp = <T>(target: T, key: (keyof T) | PropertyKey) =>
    tryCatch(() => delete (target as any)[key], false);

export const deleteProps = <T, K extends keyof T>(target: T, keys: ArrayRO<K>) =>
    keys.forEach((key) => deleteProp(target, key));

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
} = (fn: Func0, onError?: Func1) => {
    try {
        return fn();
    } catch (error) {
        return applyIfFunction(onError, error);
    }
};

export const getObjectTag = (arg: any) => stringifyObj(arg).replace(/^\[object |]$/g, "");
