import {Rewrite} from "./object";
import {IfExtends, IsExact, IsExtends} from "./types";

declare const ERROR: unique symbol;

export type ERROR<T = any> = { [ERROR]: T; };

export type ValidateNotExtends<X, Y> = IfExtends<X, Y, { [ERROR]: [X, "should not extends", Y] }, X>;

export type AssertError<T extends ERROR> = T;
export type AssertExtends<T extends U, U> = IsExtends<T, U>;
export type AssertNotExtends<T extends T1, U, T1 = ValidateNotExtends<T, U>> = true;

export type AssertExact<T extends ValidateExact<T1, U1, "T">,
    U extends ValidateExact<U1, T1, "U">,
    T1 = Rewrite<T>,
    U1 = Rewrite<U>> = IsExact<T, U>;

type ValidateExact<T, U, Z> =
    [keyof T] extends [keyof U]
    ? U
    : U & ERROR<[Z, "Missed", Omit<T, keyof U>]>;
