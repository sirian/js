import {Ctor0, CtorArgs, Ensure, Func, Get, Instance, Newable} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Var} from "./Var";
import {XSet} from "./XSet";

export interface ProtoChainOptions {
    self?: boolean;
    maxDepth?: number;
    stopAt?: object;
}

export class Ref {
    public static getPrototype(target: any) {
        if (Var.isNullable(target)) {
            return;
        }
        return Reflect.getPrototypeOf(Obj.wrap(target));
    }

    public static setPrototype(target: object, proto: object | null) {
        return Reflect.setPrototypeOf(target, proto);
    }

    public static ownNames<T>(target: T) {
        return Object.getOwnPropertyNames(target) as Array<keyof T>;
    }

    public static ownSymbols<S extends symbol>(target: { [P in S]: any }) {
        return Object.getOwnPropertySymbols(target) as S[];
    }

    public static ownKeys<T extends object>(target: T): Array<keyof T> {
        return Reflect.ownKeys(target) as Array<keyof T>;
    }

    public static descriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    public static descriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
    public static descriptor<T, K extends keyof any>(target: T, key: K) {
        for (const obj of Ref.getPrototypes(target)) {
            const descriptor = Ref.ownDescriptor(obj, key);
            if (descriptor) {
                return descriptor;
            }
        }
    }

    public static ownDescriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    public static ownDescriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
    public static ownDescriptor(target: any, key: PropertyKey) {
        return Object.getOwnPropertyDescriptor(target, key);
    }

    public static ownDescriptors<T>(target: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } {
        return Object.getOwnPropertyDescriptors(target);
    }

    public static define<T, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): boolean;
    public static define(t: object, k: PropertyKey, d: PropertyDescriptor): boolean;
    public static define(t: object, k: PropertyKey, d: PropertyDescriptor) {
        return Reflect.defineProperty(t, k, d);
    }

    public static getConstructor<T extends any>(target: T): Newable<T> | undefined {
        const ctor = target && target.constructor;

        if (Var.isConstructor(ctor)) {
            return ctor;
        }
    }

    public static isWritable(target: any, property: PropertyKey) {
        if (Var.isNullable(target)) {
            return false;
        }

        const desc = Ref.descriptor(target, property);
        if (!desc) {
            return Var.isPrimitive(target) || Object.isExtensible(target);
        }

        return desc.writable || Var.isFunction(desc.set);
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

        while (!Var.isNullable(current)) {
            if (maxDepth && result.size >= maxDepth) {
                break;
            }
            if (result.has(current) || stopAt === current) {
                break;
            }
            if (!Var.isPrimitive(current)) {
                result.add(current);
            }
            current = Ref.getPrototype(current);
        }

        if (!self) {
            result.delete(target);
        }

        return [...result];
    }

    public static hasOwn<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        return !Var.isNullable(target) && Object.prototype.hasOwnProperty.call(target, key);
    }

    public static has<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        return !Var.isNullable(target) && Reflect.has(Obj.wrap(target) as any, key);
    }

    public static hasMethod<T, K extends keyof any>(target: T, key: K): target is Record<K, Func> & T {
        return Var.isFunction(Ref.get(target, key));
    }

    public static get<T, K extends keyof any>(target: T, key: K) {
        if (!Var.isNullable(target)) {
            return (target as any)[key] as Get<T, K>;
        }
    }

    public static set<T, K extends keyof any>(target: T, key: K, value: Get<T, K, any>) {
        if (!Var.isPrimitive(target)) {
            (target as any)[key] = value;
        }
    }

    public static delete<T, K extends keyof T>(target: T, key: K | keyof any) {
        if (!Var.isPrimitive(target)) {
            Reflect.deleteProperty(target as any, key);
        }
    }
}
