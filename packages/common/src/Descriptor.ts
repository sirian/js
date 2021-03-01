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

export function isDescriptor(d: any): d is AccessorPropertyDescriptor | DataPropertyDescriptor {
    return DescriptorType.NONE !== getDescriptorType(d);
}

export function isAccessorDescriptor(d: any): d is AccessorPropertyDescriptor {
    return DescriptorType.ACCESSOR === getDescriptorType(d);
}

export function isDataDescriptor(d: any): d is DataPropertyDescriptor {
    return DescriptorType.DATA === getDescriptorType(d);
}

export function getDescriptorType(d: any) {
    if (!isPlainObject(d)) {
        return DescriptorType.NONE;
    }

    let hasAccessor = false;
    let hasValueOrWritable = false;

    for (const [key, v] of entriesOf(d)) {
        const defined = undefined !== v;

        switch (key) {
            case "enumerable":
            case "configurable":
                if (defined && !isBoolean(v)) {
                    return DescriptorType.NONE;
                }
                break;
            case "writable":
                if (defined && !isBoolean(v)) {
                    return DescriptorType.NONE;
                }
                hasValueOrWritable = true;
                break;
            case "value":
                hasValueOrWritable = true;
                break;
            case "get":
            case "set":
                if (defined && !isFunction(v)) {
                    return DescriptorType.NONE;
                }
                hasAccessor = true;
                break;
            default:
                return DescriptorType.NONE;
        }
    }

    if (hasAccessor && hasValueOrWritable) {
        return DescriptorType.NONE;
    }

    return hasAccessor ? DescriptorType.ACCESSOR : DescriptorType.DATA;
}

export function extendDescriptor<D extends TypedPropertyDescriptor<any>>(desc: D, data: D): D;
export function extendDescriptor(desc: PropertyDescriptor | undefined, data: PropertyDescriptor): PropertyDescriptor;
export function extendDescriptor(desc: PropertyDescriptor = {}, newDesc: PropertyDescriptor = {}) {
    const base = {
        configurable: true,
        enumerable: false,
    };

    if (isAccessorDescriptor(newDesc)) {
        return {
            ...base,
            get: desc.get,
            set: desc.set,
            ...newDesc,
        };
    }

    return {
        ...base,
        writable: desc.writable ?? true,
        value: desc.value,
        ...newDesc,
    };
}

export const readDescriptor = <D extends PropertyDescriptor>(desc: D | undefined, obj: any) =>
    (desc?.get && !isNullish(obj)
     ? desc.get.call(obj)
     : desc?.value) as D extends TypedPropertyDescriptor<infer T> ? T : any;

export function wrapDescriptor<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
export function wrapDescriptor<T extends object, V>(target: T, key: PropertyKey, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
export function wrapDescriptor<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>) {
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
}

export function writeDescriptor<T, K extends keyof T>(desc: TypedPropertyDescriptor<T[K]>, object: T, key: K, value: T[K]): void;
export function writeDescriptor<T>(desc: TypedPropertyDescriptor<T>, object: any, key: PropertyKey, value: T): void;
export function writeDescriptor(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any): void;
export function writeDescriptor(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any) {
    desc?.set ? desc.set.call(object, value) : defineProp(object, key, extendDescriptor(desc, {value}));
}
