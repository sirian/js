import {
    Args,
    Ctor0,
    CtorArgs,
    DescriptorOf,
    Ensure,
    Func,
    Func0,
    Instance,
    Newable,
    Return,
} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Var} from "./Var";
import {XSet} from "./XSet";

export interface ProtoChainOptions {
    maxDepth?: number;
    stopAt?: object;
}

export class Ref {
    public static getPrototypeOf(target: object) {
        return Reflect.getPrototypeOf(target);
    }

    public static setPrototypeOf(target: object, proto: object | null) {
        return Reflect.setPrototypeOf(target, proto);
    }

    public static ownPropertyNames<T>(target: T) {
        return Object.getOwnPropertyNames(target) as Array<keyof T>;
    }

    public static ownPropertySymbols<S extends symbol>(target: { [P in S]: any }) {
        return Object.getOwnPropertySymbols(target) as S[];
    }

    public static ownProperties<T extends object>(target: T) {
        return [
            ...Ref.ownPropertyNames(target),
            ...Ref.ownPropertySymbols(target),
        ];
    }

    public static getDescriptor<T, K extends keyof any>(target: T, key: K) {
        for (const obj of Ref.getProtoChain(target)) {
            const descriptor = Ref.getOwnDescriptor(obj, key);
            if (descriptor) {
                return descriptor as DescriptorOf<T, K>;
            }
        }
    }

    public static getOwnDescriptor<T, K extends keyof T>(target: T, key: K): TypedPropertyDescriptor<T[K]> | undefined;
    public static getOwnDescriptor(target: any, key: PropertyKey): PropertyDescriptor | undefined;
    public static getOwnDescriptor(target: any, key: PropertyKey) {
        return Object.getOwnPropertyDescriptor(target, key);
    }

    public static getOwnDescriptors<T>(target: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } {
        return Object.getOwnPropertyDescriptors(target);
    }

    public static defineProperty<T, K extends keyof T>(t: T, k: K, d: TypedPropertyDescriptor<T[K]>): boolean;
    public static defineProperty(t: object, k: PropertyKey, d: PropertyDescriptor): boolean;
    public static defineProperty(t: object, k: PropertyKey, d: PropertyDescriptor) {
        return Reflect.defineProperty(t, k, d);
    }

    public static getConstructor<T extends any>(target: T): Newable<T> | undefined {
        const ctor = target && target.constructor;

        if (Var.isConstructor(ctor)) {
            return ctor;
        }
    }

    public static isWritable(object: any, property: PropertyKey) {
        if (!Var.isObjectOrFunction(object)) {
            return false;
        }

        const desc = Ref.getDescriptor(object, property);
        if (!desc) {
            return Object.isExtensible(object);
        }

        return desc.writable || Var.isFunction(desc.set);
    }

    public static construct<F extends Ctor0>(constructor: F, args?: CtorArgs<F>, newTarget?: Function): Instance<F>;
    public static construct<F extends Newable>(constructor: F, args: CtorArgs<F>, newTarget?: Function): Instance<F>;

    public static construct(target: Function, args: any[] = [], newTarget?: Function) {
        const rest = newTarget ? [newTarget] : [];
        return Reflect.construct(target, args, ...rest);
    }

    public static apply<F extends Func0>(target: F, thisArg?: any, args?: Args<F>): Return<F>;
    public static apply<F extends Func>(target: F, thisArg: any, args: Args<F>): Return<F>;
    public static apply(target: Func, thisArg?: any, args: any[] = []) {
        return Reflect.apply(target, thisArg, args);
    }

    public static getProtoChain<T>(target: T, options: ProtoChainOptions = {}): [T, ...Array<Partial<T>>] {
        const result = new XSet<any>();
        const {maxDepth, stopAt} = options;

        for (let current: Partial<T> = target; ;) {
            if (maxDepth && (result.size >= maxDepth)) {
                break;
            }
            if (Var.isPrimitive(current) || result.has(current) || stopAt === current) {
                break;
            }
            result.add(current);
            current = Ref.getPrototypeOf(current);
        }

        return [...result] as [T, ...Array<Partial<T>>];
    }

    public static hasOwn<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return Object.hasOwnProperty.call(target, key);
    }

    public static has<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return key in Obj.wrap(target);
    }

    public static hasMethod<T, K extends keyof any>(target: T, key: K): target is Record<K, Func> & T {
        if (!Ref.has(target, key)) {
            return false;
        }

        return Var.isFunction(target[key]);
    }
}
