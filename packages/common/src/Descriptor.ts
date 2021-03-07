import {AccessorPropertyDescriptor, DataPropertyDescriptor, Get, Nullish} from "@sirian/ts-extra-types";
import {isBoolean, isFunction, isObject, isUndefined} from "./Is";
import {defineProp, deleteProps, getDescriptor, hasAnyProp} from "./Ref";

export enum DescriptorType {
    NONE = "NONE",
    DATA = "DATA",
    ACCESSOR = "ACCESSOR",
}

export type DescriptorWrapper<T, V> = {
    get?(object: T, parent: () => V): V;
    set?(object: T, value: V, parent: (value: V) => void): V;
};

const GET_SET = ["get", "set"] as const;
const VALUE_WRITABLE = ["value", "writable"] as const;

export const getDescriptorType = (d: any) => {
    const hasAccessor = hasAnyProp(d, GET_SET);
    const hasValueOrWritable = hasAnyProp(d, VALUE_WRITABLE);
    const bad = !isObject(d)
        || hasAccessor && hasValueOrWritable
        || hasAccessor && [d.get, d.set].some((v) => !isUndefined(v) && !isFunction(v))
        || [d.enumerable, d.configurable, d.writable].some((v) => !isUndefined(v) && !isBoolean(v));

    if (bad) {
        return DescriptorType.NONE;
    }

    return hasAccessor ? DescriptorType.ACCESSOR : DescriptorType.DATA;
};

export const isDescriptor = (d: any): d is AccessorPropertyDescriptor | DataPropertyDescriptor =>
    DescriptorType.NONE !== getDescriptorType(d);

export const isAccessorDescriptor = (d: any): d is AccessorPropertyDescriptor =>
    DescriptorType.ACCESSOR === getDescriptorType(d);

export const isDataDescriptor = (d: any): d is DataPropertyDescriptor =>
    DescriptorType.DATA === getDescriptorType(d);

export const extendDescriptor: {
    <D extends TypedPropertyDescriptor<any>>(desc: PropertyDescriptor | Nullish, data: D): D;
    (desc: PropertyDescriptor | Nullish, data: PropertyDescriptor): PropertyDescriptor;
} = (desc: PropertyDescriptor | Nullish, newDesc: PropertyDescriptor = {}) => {
    desc = {
        configurable: true,
        enumerable: false,
        writable: true,
        ...desc,
    };

    if (hasAnyProp(newDesc, GET_SET)) {
        deleteProps(desc, VALUE_WRITABLE);
    }

    if (hasAnyProp(newDesc, VALUE_WRITABLE)) {
        deleteProps(desc, GET_SET);
    }

    return {
        ...desc,
        ...newDesc,
    };
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
    const get = wrapper.get;
    const set = wrapper.set;

    const descriptor = extendDescriptor(desc, {
        get(this: T) {
            const parent = () => readDescriptor(desc, this);
            return get ? get(this, parent) : parent();
        },
        set(this: T, value: V) {
            const parent = (v: V) => writeDescriptor(desc, this, key, v);

            set ? set(this, value, parent) : parent(value);
        },
    });

    defineProp(target, key, descriptor);

    return descriptor;
};

export const writeDescriptor: {
    <T, K extends keyof T>(desc: TypedPropertyDescriptor<T[K]>, object: T, key: K, value: T[K]): void;
    <T>(desc: TypedPropertyDescriptor<T>, object: any, key: PropertyKey, value: T): void;
    (desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any): void;
} = (desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any) => {
    desc?.set ? desc.set.call(object, value) : defineProp(object, key, extendDescriptor(desc, {value}));
};
