import {AccessorPropertyDescriptor, DataPropertyDescriptor} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Var} from "./Var";

export enum DescriptorType {
    NONE = "NONE",
    DATA = "DATA",
    ACCESSOR = "ACCESSOR",
}

export class Descriptor<T extends AccessorPropertyDescriptor | DataPropertyDescriptor> {
    protected desc: T;

    constructor(desc: T) {
        this.desc = desc;
        if (!Descriptor.isDescriptor(desc)) {
            throw new Error(`Expected descriptor, given ${desc}`);
        }
    }

    public static from<T, K extends keyof T>(target: T, key: K): Descriptor<TypedPropertyDescriptor<T[K]>> {
        const desc = Ref.getOwnDescriptor(target, key);

        if (!desc) {
            throw new Error(`Descriptor ${target}[${key}] not found`);
        }

        return new Descriptor(desc);
    }

    public static read<T>(desc: TypedPropertyDescriptor<T>, obj: any): T;
    public static read(desc: PropertyDescriptor, obj: any): any;

    public static read(desc: any, obj: any) {
        const type = this.getDescriptorType(desc);

        switch (type) {
            case DescriptorType.ACCESSOR:
                const getter = desc.get;
                return getter ? getter.call(obj) : void 0;
            case DescriptorType.DATA:
                return desc.value;
        }

        throw new Error(`Expected descriptor, given ${desc}`);
    }

    public static isDescriptor(d: any): d is AccessorPropertyDescriptor | DataPropertyDescriptor {
        return DescriptorType.NONE !== this.getDescriptorType(d);
    }

    public static isAccessorDescriptor(d: any): d is AccessorPropertyDescriptor {
        return DescriptorType.ACCESSOR === this.getDescriptorType(d);
    }

    public static isDataDescriptor(d: any): d is DataPropertyDescriptor {
        return DescriptorType.DATA === this.getDescriptorType(d);
    }

    public static getDescriptorType(d: any) {
        if (!Var.isPlainObject(d)) {
            return DescriptorType.NONE;
        }

        let hasAccessor = false;
        let hasValueOrWritable = false;

        for (const key of Obj.keys(d)) {
            const v = d[key];
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
