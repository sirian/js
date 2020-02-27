import {Ctor0, CtorArgs, Ensure, Func, Instance, Newable} from "@sirian/ts-extra-types";
import {TypedPropertyDescriptorMap} from "./Obj";
import {
    ifSatisfy,
    isConstructor,
    isFunction,
    isNullish,
    isObjectOrFunction,
    isPrimitive,
    isString,
    isSymbol,
} from "./Var";
import {XSet} from "./XSet";

export interface ProtoChainOptions {
    self?: boolean;
    maxDepth?: number;
    stopAt?: object;
}

export const getPrototype = (target: any) => {
    if (!isNullish(target)) {
        return Reflect.getPrototypeOf(Object(target));
    }
};

export const getPrototypes = <T>(target: T, options: ProtoChainOptions = {}): Array<Partial<T>> => {
    const result = new XSet<any>();
    const {maxDepth, stopAt, self = true} = options;

    let current: any = target;

    while (!isNullish(current)) {
        if (maxDepth && result.size >= maxDepth) {
            break;
        }
        if (result.has(current) || stopAt === current) {
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

export const setPrototype = (target: object, proto: object | null) => Reflect.setPrototypeOf(target, proto);

export const hasMethod = <T extends any, K extends PropertyKey>(target: T, key: K): target is T & Record<K, Func> => !isNullish(target) && isFunction(target[key]);

export const hasOwn = <T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> => !isNullish(target) && Object.prototype.hasOwnProperty.call(target, key);

export const ownKeys = <T>(target: T) => (isObjectOrFunction(target) ? Reflect.ownKeys(target) : []) as Array<keyof T>;
export const ownSymbols = <S extends symbol>(target: { [P in S]: any }) => ownKeys(target).filter(isSymbol);
export const ownNames = <T>(target: T) => ownKeys(target).filter(isString) as Array<Extract<keyof T, string>>;

export function ownDescriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
export function ownDescriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
export function ownDescriptor(target: any, key: PropertyKey) {
    return Object.getOwnPropertyDescriptor(target, key);
}

export function getDescriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
export function getDescriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
export function getDescriptor(target: any, key: PropertyKey) {
    while (target) {
        const descriptor = ownDescriptor(target, key);
        if (descriptor) {
            return descriptor;
        }
        target = getPrototype(target);
    }
}

export const getDescriptors = <T>(target: T) => {
    const result: Record<any, any> = {};

    for (const obj of getPrototypes(target)) {
        for (const key of ownKeys(obj)) {
            if (!hasOwn(result, key)) {
                result[key] = ownDescriptor(obj, key);
            }
        }
    }
    return result as TypedPropertyDescriptorMap<T>;
};

export const ownDescriptors = <T>(target: T) => Object.getOwnPropertyDescriptors(target);

export function defineProp<T, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): boolean;
export function defineProp(t: object, k: PropertyKey, d: TypedPropertyDescriptor<any> | PropertyDescriptor): boolean;
export function defineProp(t: object, k: PropertyKey, d: PropertyDescriptor) {
    return Reflect.defineProperty(t, k, d);
}

export const getConstructor = <T extends any>(target: T): Newable<T> | undefined =>
    ifSatisfy(target && target.constructor, isConstructor);

export function apply<R, A extends any[]>(target: (...args: A) => R, thisArg: any, args: A): R;
export function apply<R>(target: () => R, thisArg?: any, args?: []): R;
export function apply(target: Func, thisArg?: any, args: any[] = []) {
    return Reflect.apply(target, thisArg, args);
}

export function construct<F extends Ctor0>(constructor: F, args?: CtorArgs<F>, newTarget?: Function): Instance<F>;
export function construct<F extends Newable>(constructor: F, args: CtorArgs<F>, newTarget?: Function): Instance<F>;
export function construct(target: Function, args: any[] = [], newTarget?: Function) {
    return Reflect.construct(target, args, ...(newTarget ? [newTarget] : []));
}

export function hasProp<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> {
    return !isNullish(target) && (key in Object(target));
}

export function getProp<T, K extends keyof T>(target: T, key: K): T[K];
export function getProp<V, K extends PropertyKey>(target: { [P in K]: V }, key: K): V;
export function getProp(target: any, key: PropertyKey): any;
export function getProp(target: any, key: any) {
    return isNullish(target) ? undefined : target[key];
}

export function setProp<T, K extends keyof T>(target: T, key: K, value: T[K]): boolean;
export function setProp<V, K extends PropertyKey>(target: { [P in K]: V }, key: K, value: V): boolean;
export function setProp(target: any, key: PropertyKey, value: any): boolean;
export function setProp(target: any, key: PropertyKey, value: any) {
    return isObjectOrFunction(target) && Reflect.set(target, key, value);
}

export function deleteProp<T>(target: T, key: (keyof T) | PropertyKey) {
    if (isNullish(target)) {
        return true;
    }
    try {
        return delete target[key as keyof T];
    } catch (e) {
        return false;
    }
}

export function isPropWritable(target: any, property: PropertyKey) {
    if (isNullish(target)) {
        return false;
    }

    const desc = getDescriptor(target, property);
    if (!desc) {
        return isPrimitive(target) || Object.isExtensible(target);
    }

    return desc.writable || isFunction(desc.set);
}

export const Ref = {
    apply,
    construct,
    define: defineProp,
    delete: deleteProp,
    descriptor: getDescriptor,
    descriptors: getDescriptors,
    get: getProp,
    getConstructor,
    getPrototype,
    getPrototypes,
    has: hasProp,
    hasMethod,
    hasOwn,
    ownDescriptor,
    ownDescriptors,
    ownKeys,
    ownNames,
    ownSymbols,
    set: setProp,
    setPrototype,
};
