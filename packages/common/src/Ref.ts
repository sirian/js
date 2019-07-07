import {Args, Ctor, DescriptorOf, Ensure, Func} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Var} from "./Var";
import {XSet} from "./XSet";

export const Ref = new class {
    public getPrototypeOf(target: object) {
        return Reflect.getPrototypeOf(target);
    }

    public setPrototypeOf(target: object, proto: object | null) {
        return Reflect.setPrototypeOf(target, proto);
    }

    public ownEnumerablePropertyNames<T>(target: T) {
        return Obj.keys(target);
    }

    public ownPropertyNames<T>(target: T) {
        return Object.getOwnPropertyNames(target) as Array<keyof T>;
    }

    public ownPropertySymbols<S extends symbol>(target: { [P in S]: any }) {
        return Object.getOwnPropertySymbols(target) as S[];
    }

    public ownProperties<T extends object>(target: T) {
        return [
            ...Ref.ownPropertyNames(target),
            ...Ref.ownPropertySymbols(target),
        ];
    }

    public getDescriptor<T, K extends keyof any>(target: T, key: K) {
        for (const obj of Ref.getProtoChain(target)) {
            const descriptor: unknown = Ref.getOwnDescriptor(obj, key);
            if (descriptor) {
                return descriptor as DescriptorOf<T, K>;
            }
        }
    }

    public getOwnDescriptor<T, K extends keyof any>(target: T, key: K) {
        return Object.getOwnPropertyDescriptor(target, key) as DescriptorOf<T, K> | undefined;
    }

    public getOwnDescriptors<T>(target: T) {
        return Object.getOwnPropertyDescriptors(target);
    }

    public defineProperty<T extends object, K extends keyof any>(t: T, k: K, d: DescriptorOf<T, K>) {
        return Reflect.defineProperty(t, k, d);
    }

    public getConstructor<T extends any>(target: T) {
        if (Var.isNullable(target)) {
            return;
        }

        return target.constructor as Ctor<T>;
    }

    public isWritable(object: any, property: PropertyKey) {
        if (!Var.isObjectOrFunction(object)) {
            return false;
        }

        const desc = Ref.getOwnDescriptor(object, property);
        if (!desc) {
            return Object.isExtensible(object);
        }

        return true === desc.writable || Var.isFunction(desc.set);
    }

    public construct<F extends Ctor>(constructor: F, args: Args<F>, newTarget?: Function): InstanceType<F>;

    public construct(...args: Args<typeof Reflect["construct"]>) {
        return Reflect.construct(...args);
    }

    public apply<F extends Func>(target: F, thisArg: any, args: Args<F>): ReturnType<F> {
        return Reflect.apply(target, thisArg, args);
    }

    public getProtoChain(target: any) {
        const result = new XSet<object>();

        let current: any = target;

        while (Var.isObjectOrFunction(current) && !result.has(current)) {
            result.add(current);
            current = Ref.getPrototypeOf(current);
        }

        return result.toArray();
    }

    public hasOwn<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return Object.hasOwnProperty.call(target, key);
    }

    public has<T, K extends keyof any>(target: T, key: K): target is Ensure<T, K> {
        if (Var.isNullable(target)) {
            return false;
        }

        return key in Obj.wrap(target);
    }

    public hasMethod<T, K extends keyof any>(target: T, key: K): target is Record<K, Func> & T {
        if (!Ref.has(target, key)) {
            return false;
        }

        return Var.isFunction(target[key]);
    }
};
