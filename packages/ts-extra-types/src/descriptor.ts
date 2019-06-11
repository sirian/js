import {OptionalKeys} from "./object";

export type DataPropertyDescriptor<V = any> = {
    configurable?: boolean;
    enumerable?: boolean;
    value?: V;
    writable?: boolean;
};

export type DescriptorGetter<T> = {
    get(): T;
};

export type DescriptorSetter<T> = {
    set(value: T): void;
};

export type AccessorPropertyDescriptor<T = any> = {
        configurable?: boolean;
        enumerable?: boolean;
    }
    & Partial<DescriptorGetter<T> & DescriptorSetter<T>>
    & (DescriptorGetter<T> | DescriptorSetter<T>);

export type DescriptorOf<T, K extends PropertyKey> =
    K extends keyof T ? TypedPropertyDescriptor<T[K]> : PropertyDescriptor;

export type PickDescriptor<T, K extends PropertyKey> =
    K extends OptionalKeys<T> ? TypedPropertyDescriptor<T[K]> | undefined :
    K extends keyof T ? TypedPropertyDescriptor<T[K]> :
    PropertyDescriptor | undefined;
