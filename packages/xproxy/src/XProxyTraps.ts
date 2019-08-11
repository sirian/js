import {CtorArgs, FnArgs, KeyOf} from "@sirian/ts-extra-types";

export type ProxyTrap = keyof XProxyTraps<any>;

export interface XProxyTraps<T> {
    getPrototypeOf?: (target: T) => object | null | void;

    setPrototypeOf?: (target: T, v: any) => boolean | void;

    isExtensible?: (target: T) => boolean | void;

    preventExtensions?: (target: T) => boolean | void;

    getOwnPropertyDescriptor?: <K extends keyof T>(target: T, p: K) => TypedPropertyDescriptor<T[K]> | void;

    has?: <K extends keyof T>(target: T, p: K) => boolean | void;

    get?: <K extends keyof T>(target: T, p: K, receiver: any) => T[K] | void;

    set?: <K extends keyof T>(target: T, p: K, value: T[K], receiver: any) => boolean | void;

    deleteProperty?: <K extends keyof T>(target: T, p: K) => boolean | void;

    defineProperty?: <K extends keyof T>(target: T, p: K, attributes: TypedPropertyDescriptor<T[K]>) => boolean | void;

    ownKeys?: (target: T) => KeyOf<T> | void;

    apply?: (target: T, thisArg: any, argArray: FnArgs<T>) => any | void;

    construct?: (target: T, argArray: any, newTarget: CtorArgs<T>) => object | void;
}
