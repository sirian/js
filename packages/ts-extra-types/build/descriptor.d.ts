import { OptionalKeys } from "./object";
export declare type DataPropertyDescriptor<V = any> = {
    configurable?: boolean;
    enumerable?: boolean;
    value?: V;
    writable?: boolean;
};
export declare type DescriptorGetter<T> = {
    get(): T;
};
export declare type DescriptorSetter<T> = {
    set(value: T): void;
};
export declare type AccessorPropertyDescriptor<T = any> = {
    configurable?: boolean;
    enumerable?: boolean;
} & Partial<DescriptorGetter<T> & DescriptorSetter<T>> & (DescriptorGetter<T> | DescriptorSetter<T>);
export declare type DescriptorOf<T, K extends PropertyKey> = K extends keyof T ? TypedPropertyDescriptor<T[K]> : PropertyDescriptor;
export declare type PickDescriptor<T, K extends PropertyKey> = K extends OptionalKeys<T> ? TypedPropertyDescriptor<T[K]> | undefined : K extends keyof T ? TypedPropertyDescriptor<T[K]> : PropertyDescriptor | undefined;
//# sourceMappingURL=descriptor.d.ts.map