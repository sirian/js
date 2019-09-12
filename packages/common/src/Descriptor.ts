import {AccessorPropertyDescriptor, DataPropertyDescriptor, Get} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Var} from "./Var";

export enum DescriptorType {
    NONE = "NONE",
    DATA = "DATA",
    ACCESSOR = "ACCESSOR",
}

export type DescriptorWrapper<T, V> = {
    get?(object: T, parent: () => V): V;
    set?(object: T, value: V, parent: (value: V) => void): V;
};

export class Descriptor {
    public static wrap<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
    public static wrap<T extends object, V>(target: T, key: PropertyKey, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
    public static wrap<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>) {
        const desc = Ref.descriptor(target, key);
        const {get, set} = wrapper;

        const descriptor = Descriptor.extend(desc, {
            get(this: T) {
                const parent = () => Descriptor.read(desc, this);
                return get ? get(this, parent) : parent();
            },
            set(this: T, value: V) {
                const object = this;
                const parent = (v: V) => Descriptor.write(desc, this, key, v);

                if (set) {
                    set(object, value, parent);
                } else {
                    parent(value);
                }
            },
        });

        Ref.define(target, key, descriptor);

        return descriptor;
    }

    public static extend<D extends TypedPropertyDescriptor<any>>(desc: D, data: D): D;
    public static extend(desc: PropertyDescriptor | undefined, data: PropertyDescriptor): PropertyDescriptor;
    public static extend(desc: PropertyDescriptor = {}, newDesc: PropertyDescriptor = {}) {
        const {
            configurable = true,
            enumerable = false,
            writable = true,
            get,
            set,
            value,
        } = desc;

        if (Descriptor.isAccessorDescriptor(newDesc)) {
            desc = {get, set};
        } else if (Descriptor.isDataDescriptor(newDesc)) {
            desc = {writable, value};
        }

        return {
            configurable,
            enumerable,
            ...desc,
            ...newDesc,
        };
    }

    public static read<T>(desc: TypedPropertyDescriptor<T>, obj: any): T;
    public static read(desc: PropertyDescriptor | undefined, obj: any): any;

    public static read(desc: PropertyDescriptor | undefined, obj: any) {
        if (desc) {
            const {get, value} = desc;
            return get ? Ref.apply(get, obj) : value;
        }
    }

    public static write<T, K extends keyof T>(desc: TypedPropertyDescriptor<T[K]>, object: T, key: K, value: T[K]): void;
    public static write<T>(desc: TypedPropertyDescriptor<T>, object: any, key: PropertyKey, value: T): void;
    public static write(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any): void;
    public static write(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any) {
        if (!Descriptor.isAccessorDescriptor(desc)) {
            Ref.define(object, key, Descriptor.extend(desc, {value}));
            return;
        }
        const setter = desc.set;
        if (setter) {
            Ref.apply(setter, object, [value]);
        }
    }

    public static isDescriptor(d: any): d is AccessorPropertyDescriptor | DataPropertyDescriptor {
        return DescriptorType.NONE !== Descriptor.getDescriptorType(d);
    }

    public static isAccessorDescriptor(d: any): d is AccessorPropertyDescriptor {
        return DescriptorType.ACCESSOR === Descriptor.getDescriptorType(d);
    }

    public static isDataDescriptor(d: any): d is DataPropertyDescriptor {
        return DescriptorType.DATA === Descriptor.getDescriptorType(d);
    }

    public static getDescriptorType(d: any) {
        if (!Var.isPlainObject(d)) {
            return DescriptorType.NONE;
        }

        let hasAccessor = false;
        let hasValueOrWritable = false;

        for (const [key, v] of Obj.entries(d)) {
            const type = typeof v;
            const defined = undefined !== v;

            switch (key) {
                case "enumerable":
                case "configurable":
                    if (defined && "boolean" !== type) {
                        return DescriptorType.NONE;
                    }
                    break;
                case "writable":
                    if (defined && "boolean" !== type) {
                        return DescriptorType.NONE;
                    }
                    hasValueOrWritable = true;
                    break;
                case "value":
                    hasValueOrWritable = true;
                    break;
                case "get":
                case "set":
                    if (defined && "function" !== type) {
                        return DescriptorType.NONE;
                    }
                    hasAccessor = true;
                    break;
                default:
                    return DescriptorType.NONE;
            }
        }

        if (hasAccessor) {
            return hasValueOrWritable ? DescriptorType.NONE : DescriptorType.ACCESSOR;
        } else {
            return DescriptorType.DATA;
        }
    }
}
