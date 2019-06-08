import { Rewrite } from "./object";
import { IfExtends, IsExact, IsExtends } from "./types";
declare const ERROR: unique symbol;
export declare type ERROR<T = any> = {
    [ERROR]: T;
};
export declare type ValidateNotExtends<X, Y> = IfExtends<X, Y, {
    [ERROR]: [X, "should not extends", Y];
}, X>;
export declare type AssertError<T extends ERROR> = T;
export declare type AssertExtends<T extends U, U> = IsExtends<T, U>;
export declare type AssertNotExtends<T extends T1, U, T1 = ValidateNotExtends<T, U>> = true;
export declare type AssertExact<T extends ValidateExact<T1, U1, "T">, U extends ValidateExact<U1, T1, "U">, T1 = Rewrite<T>, U1 = Rewrite<U>> = IsExact<T, U>;
declare type ValidateExact<T, U, Z> = [keyof T] extends [keyof U] ? U : U & ERROR<[Z, "Missed", Omit<T, keyof U>]>;
export {};
//# sourceMappingURL=assert.d.ts.map