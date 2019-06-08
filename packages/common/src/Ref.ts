import {Args, Ctor, DescriptorOf, Ensure, Func, KeyOf, SymbolOf} from "@sirian/ts-extra-types";
import {global} from "./global";
import {_Object} from "./native";
import {Obj} from "./Obj";
import {Var} from "./Var";
import {XSet} from "./XSet";

const Reflect = global.Reflect;

export class Ref {
    public static getPrototypeOf(target: object) {
        return Reflect.getPrototypeOf(target);
    }

    public static setPrototypeOf(target: object, proto: object | null) {
        return Reflect.setPrototypeOf(target, proto);
    }

    public static ownEnumerablePropertyNames<T>(target: T) {
        return Obj.keys(target);
    }

    public static ownPropertyNames<T>(target: T) {
        return _Object.getOwnPropertyNames(target) as Array<KeyOf<T>>;
    }

    public static ownPropertySymbols<T>(target: T) {
        return _Object.getOwnPropertySymbols(target) as Array<SymbolOf<T>>;
    }

    public static ownProperties<T extends object>(target: T) {
        return [
            ...Ref.ownPropertyNames(target),
            ...Ref.ownPropertySymbols(target),
        ];
    }

    public static getDescriptor<T, K extends PropertyKey>(target: T, key: K) {
        for (const obj of this.getProtoChain(target)) {
            const descriptor: unknown = this.getOwnDescriptor(obj, key);
            if (descriptor) {
                return descriptor as DescriptorOf<T, K>;
            }
        }
    }

    public static getOwnDescriptor<T, K extends PropertyKey>(target: T, key: K) {
        return _Object.getOwnPropertyDescriptor(target, key) as DescriptorOf<T, K> | undefined;
    }

    public static getOwnDescriptors<T>(target: T) {
        return _Object.getOwnPropertyDescriptors(target);
    }

    public static defineProperty<T extends object, K extends PropertyKey>(t: T, k: K, d: DescriptorOf<T, K>) {
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
            return _Object.isExtensible(object);
        }

        return true === desc.writable || Var.isFunction(desc.set);
    }

    public static construct<F extends Ctor>(constructor: F, args: Args<F>, newTarget?: Function): InstanceType<F>;

    public static construct(...args: Args<typeof Reflect["construct"]>) {
        return Reflect.construct(...args);
    }

    public static apply<F extends Func>(target: F, thisArg: any, args: Args<F>): ReturnType<F> {
        return Reflect.apply(target, thisArg, args);
    }

    public static getProtoChain(target: any) {
        const result = new XSet<object>();

        let current: any = target;

        while (Var.isObjectOrFunction(current) && !result.has(current)) {
            result.add(current);
            current = Ref.getPrototypeOf(current);
        }

        return result.toArray();
    }

    public static hasOwn<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return _Object.hasOwnProperty.call(target, key);
    }

    public static has<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return key in Obj.wrap(target);
    }

    public static hasMethod<T, K extends PropertyKey>(target: T, key: K): target is Ensure<T, K, Func> {
        if (!Ref.has(target, key)) {
            return false;
        }

        return Var.isFunction(target[key]);
    }
}
