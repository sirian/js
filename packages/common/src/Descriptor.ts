import {AccessorPropertyDescriptor, DataPropertyDescriptor, Get} from "@sirian/ts-extra-types";
import {isBoolean, isFunction, isNullish} from "./Is";
import {entriesOf} from "./Obj";
import {defineProp, getDescriptor} from "./Ref";
import {isPlainObject} from "./Var";

export enum DescriptorType {
    NONE = "NONE",
    DATA = "DATA",
    ACCESSOR = "ACCESSOR",
}

export type DescriptorWrapper<T, V> = {
    get?(object: T, parent: () => V): V;
    set?(object: T, value: V, parent: (value: V) => void): V;
};

export const getDescriptorType = (d: any) => {
    if (!isPlainObject(d)) {
        return DescriptorType.NONE;
    }

    let hasAccessor = false;
    let hasValueOrWritable = false;
    let bad = false;

    for (const [key, v] of entriesOf(d)) {
        const defined = undefined !== v;

        if ("enumerable" === key || "configurable" === key || "writable" === key) {
            bad = defined && !isBoolean(v);
        }

        if ("writable" === key || "value" === key) {
            hasValueOrWritable = true;
        }

        if ("get" === key || "set" === key) {
            bad = defined && !isFunction(v);
            hasAccessor = true;
        }

        if (bad || hasAccessor && hasValueOrWritable) {
            return DescriptorType.NONE;
        }
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
    <D extends TypedPropertyDescriptor<any>>(desc: D, data: D): D;
    (desc: PropertyDescriptor | undefined, data: PropertyDescriptor): PropertyDescriptor;
} = (desc: PropertyDescriptor = {}, newDesc: PropertyDescriptor = {}) => {
    const d = isAccessorDescriptor(newDesc)
              ? {get: desc.get, set: desc.set}
              : {writable: desc.writable ?? true, value: desc.value};

    return {
        configurable: true,
        enumerable: false,
        ...d,
        ...newDesc,
    };
};

export const readDescriptor = <D extends PropertyDescriptor>(desc: D | undefined, obj: any) =>
    (desc?.get && !isNullish(obj)
     ? desc.get.call(obj)
     : desc?.value) as D extends TypedPropertyDescriptor<infer T> ? T : any;

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
