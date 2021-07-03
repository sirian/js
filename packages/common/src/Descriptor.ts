import {AccessorPropertyDescriptor, DataPropertyDescriptor, Get, Nullish} from "@sirian/ts-extra-types";
import {isBoolean, isFunction, isObject, isUndefined} from "./Is";
import {defineProp, deleteProps, getDescriptor, hasAnyProp} from "./Ref";

export type DescriptorWrapper<T, V> = {
    get?(this: void, object: T, parent: () => V): V;
    set?(this: void, object: T, value: V, parent: (value: V) => void): void;
};

export type DescriptorType = "accessor" | "data" | undefined;

export const getDescriptorType = (d: any): DescriptorType => {
    const hasAccessor = hasAnyProp(d, ["get", "set"] as const);

    const bad = !isObject(d)
        || hasAccessor && hasAnyProp(d, ["value", "writable"] as const)
        || hasAccessor && [d.get, d.set].some((v) => !isUndefined(v) && !isFunction(v))
        || [d.enumerable, d.configurable, d.writable].some((v) => !isUndefined(v) && !isBoolean(v));

    if (!bad) {
        return hasAccessor ? "accessor" : "data";
    }
};

export const isDescriptor = (d: any): d is AccessorPropertyDescriptor | DataPropertyDescriptor =>
    !!getDescriptorType(d);

export const isAccessorDescriptor = (d: any): d is AccessorPropertyDescriptor =>
    "accessor" === getDescriptorType(d);

export const isDataDescriptor = (d: any): d is DataPropertyDescriptor =>
    "data" === getDescriptorType(d);

export const extendDescriptor: {
    <D extends TypedPropertyDescriptor<any>>(desc: PropertyDescriptor | Nullish, data: D): D;
    (desc: PropertyDescriptor | Nullish, data: PropertyDescriptor | Nullish): PropertyDescriptor;
} = (desc: PropertyDescriptor | Nullish, newDesc: PropertyDescriptor | Nullish = {}) => {
    desc = {
        configurable: true,
        enumerable: false,
        ...desc,
        ...newDesc,
    };

    if (hasAnyProp(newDesc, ["get", "set"])) {
        deleteProps(desc, "value", "writable");
    }
    if (hasAnyProp(newDesc, ["value", "writable"])) {
        deleteProps(desc, "get", "set");
    }
    if (!hasAnyProp(desc, ["get", "set"])) {
        desc.writable ??= true;
    }

    return desc;
};

export const readDescriptor: {
    <T>(desc: TypedPropertyDescriptor<T>, obj: any): T;
    (desc: PropertyDescriptor | null | undefined, obj: any): any;
} = (desc: PropertyDescriptor | null | undefined, obj: any) =>
    desc?.get ? desc.get.call(obj) : desc?.value;

export const wrapDescriptor: {
    <T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
    <T extends object, V>(target: T, key: PropertyKey, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
} = <T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>) => {
    const desc = getDescriptor(target, key);
    const getter = wrapper.get;
    const setter = wrapper.set;

    const descriptor = extendDescriptor(desc, {
        get(this: T) {
            // eslint-disable-next-line unicorn/consistent-function-scoping
            const parent = () => readDescriptor(desc, this);
            return getter ? getter(this, parent) : parent();
        },
        set(this: T, value: V) {
            const parent = (v: V) => writeDescriptor(desc, this, key, v);

            setter ? setter(this, value, parent) : parent(value);
        },
    });

    defineProp(target, key, descriptor);

    return descriptor;
};

export const writeDescriptor: {
    <T, K extends keyof T>(desc: TypedPropertyDescriptor<T[K]>, object: T, key: K, value: T[K]): void;
    <T>(desc: TypedPropertyDescriptor<T>, object: any, key: PropertyKey, value: T): void;
    (desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any): void;
} = (desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any) =>
    desc?.set
    ? desc.set.call(object, value)
    : defineProp(object, key, extendDescriptor(desc, {value}));
