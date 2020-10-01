import {IfExtends, IsExact, IsExtends} from "./types";

declare const ERROR: unique symbol;

export type ERROR<T = any> = { [ERROR]: T; };

export type ValidateNotExtends<X, Y> = IfExtends<X, Y, { [ERROR]: [X, "should not extends", Y] }, X>;

export type AssertError<T extends ERROR> = T;
export type AssertExtends<T extends U, U> = IsExtends<T, U>;
export type AssertNotExtends<T extends T1, U, T1 = ValidateNotExtends<T, U>> = true;

export type AssertFalse<T extends false> = true;
export type AssertTrue<T extends true> = true;

export type AssertExact<T extends TU,
    U extends UT,
    TU = ValidateExact<T, U, "U">,
    UT = ValidateExact<U, T, "T">,
    > = IsExact<T, U>;

type ValidateExact<T, U, Z> =
    [keyof T] extends [keyof U]
    ? U
    : ERROR<[Z, "Missed", { [P in Exclude<keyof T, keyof U>]: T[P] }]>;
