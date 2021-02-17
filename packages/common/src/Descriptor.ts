import {AccessorPropertyDescriptor, DataPropertyDescriptor, Get} from "@sirian/ts-extra-types";
import {isNotNullish} from "./Is";
import {entriesOf} from "./Obj";
import {apply, defineProp, getDescriptor} from "./Ref";
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

export class Descriptor {
    public static wrap<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
    public static wrap<T extends object, V>(target: T, key: PropertyKey, wrapper: DescriptorWrapper<T, V>): TypedPropertyDescriptor<V>;
    public static wrap<T extends object, K extends keyof any, V = Get<T, K>>(target: T, key: K, wrapper: DescriptorWrapper<T, V>) {
        const desc = getDescriptor(target, key);
        const get = wrapper.get;
        const set = wrapper.set;

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

        defineProp(target, key, descriptor);

        return descriptor;
    }

    public static extend<D extends TypedPropertyDescriptor<any>>(desc: D, data: D): D;
    public static extend(desc: PropertyDescriptor | undefined, data: PropertyDescriptor): PropertyDescriptor;
    public static extend(desc: PropertyDescriptor = {}, newDesc: PropertyDescriptor = {}) {
        if (Descriptor.isAccessorDescriptor(newDesc)) {
            desc = {
                get: desc.get,
                set: desc.set,
            };
        } else if (Descriptor.isDataDescriptor(newDesc)) {
            desc = {
                writable: desc.writable ?? true,
                value: desc.value,
            };
        }

        return {
            configurable: true,
            enumerable: false,
            ...desc,
            ...newDesc,
        };
    }

    public static read<T>(desc: TypedPropertyDescriptor<T>, obj: any): T;
    public static read(desc: PropertyDescriptor | undefined, obj: any): any;

    public static read(desc: PropertyDescriptor | undefined, obj: any) {
        if (desc && isNotNullish(obj)) {
            return desc.get ? apply(desc.get, obj) : desc.value;
        }
    }

    public static write<T, K extends keyof T>(desc: TypedPropertyDescriptor<T[K]>, object: T, key: K, value: T[K]): void;
    public static write<T>(desc: TypedPropertyDescriptor<T>, object: any, key: PropertyKey, value: T): void;
    public static write(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any): void;
    public static write(desc: PropertyDescriptor | undefined, object: any, key: PropertyKey, value: any) {
        if (!Descriptor.isAccessorDescriptor(desc)) {
            defineProp(object, key, Descriptor.extend(desc, {value}));
            return;
        }
        const setter = desc.set;
        if (setter) {
            apply(setter, object, [value]);
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
        if (!isPlainObject(d)) {
            return DescriptorType.NONE;
        }

        let hasAccessor = false;
        let hasValueOrWritable = false;

        for (const [key, v] of entriesOf(d)) {
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
