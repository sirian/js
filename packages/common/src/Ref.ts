import {Ctor0, CtorArgs, Ensure, Func, Instance, Newable} from "@sirian/ts-extra-types";
import {Obj, TypedPropertyDescriptorMap} from "./Obj";
import {isConstructor, isFunction, isNullish, isObjectOrFunction, isPrimitive, isString, isSymbol} from "./Var";
import {XSet} from "./XSet";

export interface ProtoChainOptions {
    self?: boolean;
    maxDepth?: number;
    stopAt?: object;
}

export class Ref {
    public static getPrototype(target: any) {
        if (!isNullish(target)) {
            target = Obj.wrap(target);
        }
        return Reflect.getPrototypeOf(target);
    }

    public static setPrototype(target: object, proto: object | null) {
        return Reflect.setPrototypeOf(target, proto);
    }

    public static ownNames<T>(target: T) {
        return Ref.ownKeys(target).filter(function(value) { return isString(value); }) as Array<Extract<keyof T, string>>;
    }

    public static ownSymbols<S extends symbol>(target: { [P in S]: any }) {
        return Ref.ownKeys(target).filter(function(value) { return isSymbol(value); });
    }

    public static ownKeys<T>(target: T) {
        return isNullish(target)
               ? []
               : Reflect.ownKeys(Obj.wrap(target)) as Array<keyof T>;
    }

    public static descriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    public static descriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
    public static descriptor(target: any, key: PropertyKey) {
        while (target) {
            const descriptor = Ref.ownDescriptor(target, key);
            if (descriptor) {
                return descriptor;
            }
            target = Ref.getPrototype(target);
        }
    }

    public static descriptors<T>(target: T) {
        const result = Obj.create();
        for (const obj of Ref.getPrototypes(target)) {
            for (const key of Ref.ownKeys(obj)) {
                if (!Ref.has(result, key)) {
                    result[key] = Ref.ownDescriptor(obj, key);
                }
            }
        }
        return result as TypedPropertyDescriptorMap<T>;
    }

    public static ownDescriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    public static ownDescriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
    public static ownDescriptor(target: any, key: PropertyKey) {
        return Object.getOwnPropertyDescriptor(target, key);
    }

    public static ownDescriptors<T>(target: T) {
        return Object.getOwnPropertyDescriptors(target);
    }

    public static define<T, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): boolean;
    public static define(t: object, k: PropertyKey, d: TypedPropertyDescriptor<any> | PropertyDescriptor): boolean;
    public static define(t: object, k: PropertyKey, d: PropertyDescriptor) {
        return Reflect.defineProperty(t, k, d);
    }

    public static getConstructor<T extends any>(target: T): Newable<T> | undefined {
        const ctor = target && target.constructor;

        if (isConstructor(ctor)) {
            return ctor;
        }
    }

    public static isWritable(target: any, property: PropertyKey) {
        if (isNullish(target)) {
            return false;
        }

        const desc = Ref.descriptor(target, property);
        if (!desc) {
            return isPrimitive(target) || Object.isExtensible(target);
        }

        return desc.writable || isFunction(desc.set);
    }

    public static construct<F extends Ctor0>(constructor: F, args?: CtorArgs<F>, newTarget?: Function): Instance<F>;
    public static construct<F extends Newable>(constructor: F, args: CtorArgs<F>, newTarget?: Function): Instance<F>;
    public static construct(target: Function, args: any[] = [], newTarget?: Function) {
        const rest = newTarget ? [newTarget] : [];
        return Reflect.construct(target, args, ...rest);
    }

    public static apply<R, A extends any[]>(target: (...args: A) => R, thisArg: any, args: A): R;
    public static apply<R>(target: () => R, thisArg?: any, args?: []): R;
    public static apply(target: Func, thisArg?: any, args: any[] = []) {
        return Reflect.apply(target, thisArg, args);
    }

    public static getPrototypes<T>(target: T, options: ProtoChainOptions = {}): Array<Partial<T>> {
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
            current = Ref.getPrototype(current);
        }

        if (!self) {
            result.delete(target);
        }

        return [...result];
    }

    public static hasOwn<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> {
        return !isNullish(target) && Object.prototype.hasOwnProperty.call(target, key);
    }

    public static has<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> {
        return !isNullish(target) && (key in Obj.wrap(target));
    }

    public static hasMethod<T extends any, K extends PropertyKey>(target: T, key: K): target is T & Record<K, Func> {
        return isNullish(target) ? false : isFunction((target as any)[key]);
    }

    public static get<T, K extends keyof T>(target: T, key: K): T[K];
    public static get<V, K extends PropertyKey>(target: { [P in K]: V }, key: K): V;
    public static get(target: any, key: PropertyKey): any;
    public static get(target: any, key: any) {
        if (!isNullish(target)) {
            return target[key];
        }
    }

    public static set<T, K extends keyof T>(target: T, key: K, value: T[K]): boolean;
    public static set<V, K extends PropertyKey>(target: { [P in K]: V }, key: K, value: V): boolean;
    public static set(target: any, key: PropertyKey, value: any): boolean;
    public static set(target: any, key: PropertyKey, value: any) {
        return isObjectOrFunction(target) && Reflect.set(target, key, value);
    }

    public static delete<T>(target: T, key: (keyof T) | PropertyKey) {
        return isObjectOrFunction(target) && Reflect.deleteProperty(target, key);
    }
}
