import {Args, Ctor, DescriptorOf, Ensure, Func, Instance, Return} from "@sirian/ts-extra-types";
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
            const descriptor: unknown = Ref.getOwnDescriptor(obj, key);
            if (descriptor) {
                return descriptor as DescriptorOf<T, K>;
            }
        }
    }

    public static getOwnDescriptor<T, K extends keyof any>(target: T, key: K) {
        return Object.getOwnPropertyDescriptor(target, key) as DescriptorOf<T, K> | undefined;
    }

    public static getOwnDescriptors<T>(target: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } {
        return Object.getOwnPropertyDescriptors(target);
    }

    public static defineProperty<T extends object, K extends keyof any>(t: T, k: K, d: DescriptorOf<T, K>) {
        return Reflect.defineProperty(t, k, d);
    }

    public static getConstructor<T extends any>(target: T) {
        if (Var.isNullable(target)) {
            return;
        }

        return target.constructor as Ctor<T>;
    }

    public static isWritable(object: any, property: PropertyKey) {
        if (!Var.isObjectOrFunction(object)) {
            return false;
        }

        const desc = Ref.getOwnDescriptor(object, property);
        if (!desc) {
            return Object.isExtensible(object);
        }

        return true === desc.writable || Var.isFunction(desc.set);
    }

    public static construct<F extends Ctor>(constructor: F, args: Args<F>, newTarget?: Function): Instance<F>;

    public static construct(...args: Args<typeof Reflect["construct"]>) {
        return Reflect.construct(...args);
    }

    public static apply<F extends Func>(target: F, thisArg: any, args: Args<F>): Return<F> {
        return Reflect.apply(target, thisArg, args);
    }

    public static getProtoChain<T>(target: T, options: ProtoChainOptions = {}): [T, ...Array<Partial<T>>] {
        const result = new XSet<any>();
        const {maxDepth, stopAt} = options;

        for (let current: Partial<T> = target;;) {
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
