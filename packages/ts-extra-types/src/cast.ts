import {Numbers} from "./number";
import {AnyKey} from "./object";
import {AnyFunc} from "./types";

export type Cast<T, P, D extends P = P> = T extends P ? T : D;
export type CastFunc<T> = T extends AnyFunc ? T : never;
export type CastBool<T> =
    T extends boolean ? T :
    T extends undefined | void | null | false | 0 | "" ? false :
    T extends object | symbol ? true :
    boolean;

export type KeyToNumber<K extends AnyKey> =
    K extends number ? K :
    K extends keyof Numbers ? Numbers[K] :
    never;

export type KeyToString<K extends AnyKey> =
    K extends string ? K :
    K extends number ? { [P in keyof Numbers]: K extends Numbers[P] ? P : never }[keyof Numbers] :
    never;
