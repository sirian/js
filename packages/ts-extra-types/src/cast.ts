import {Numbers} from "./number";
import {AnyKey} from "./object";
import {AnyFunc} from "./types";

export type Cast<T, P, D = never> = T extends P ? T : D;
export type CastFunc<T> = Cast<T, AnyFunc>;
export type CastBool<T> =
    T extends undefined | void | null | false | 0 | "" ? false :
    T extends boolean ? T :
    T extends 1 | true ? true :
    T extends object | symbol ? true :
    boolean;

export type KeyToNumber<K extends AnyKey> =
    K extends number | string ? ToNumber<K> : never;

export type KeyToString<K extends AnyKey> =
    K extends string | number ? ToString<K> : never;

export type ToString<T> =
    T extends string | number | bigint | boolean | null | undefined ? `${T}` : string;

export type ToNumber<T> =
    T extends number ? T :
    T extends keyof Numbers ? Numbers[T] : never;
