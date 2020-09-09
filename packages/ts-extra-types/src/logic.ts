import {Ctor, Func} from "./function";
import {MustBeBoolean} from "./mustbe";
import {ArrayValueOf, Head, NonEmptyTuple, Tail} from "./tuple";

export type If<C extends boolean, T, F = never, D = never> =
    boolean extends C ? D :
    C extends true ? T : F;

export type AsType<T, U> = T extends U ? T : never;
export type AsArray<X> = AsType<X, any[]>;
export type AsFunc<X> = AsType<X, Func>;
export type AsCtor<X> = AsType<X, Ctor>;
export type AsObject<X> = AsType<X, object>;

export type IfTrue<C extends boolean, T, F = never> = If<C, T, F>;
export type IfFalse<C extends boolean, T, F = never> = If<Not<C>, T, F>;

export type Every<T extends boolean[]> =
    T extends [] ? true :
    T extends NonEmptyTuple<MustBeBoolean<infer H>> ? And<H, Every<Tail<T>>> :
    ArrayValueOf<T>;

export type Some<T extends boolean[]> =
    T extends [] ? false :
    T extends NonEmptyTuple<MustBeBoolean<infer H>> ? Or<H, Some<Tail<T>>> :
    ArrayValueOf<T>;

export type Not<C extends boolean> =
    C extends true ? false : true;

export type And<A extends boolean, B extends boolean> = A extends true ? B : false;
export type Or<A extends boolean, B extends boolean> = A extends true ? true : B;
export type Xor<A extends boolean, B extends boolean> = If<A, Not<B>, B>;

export type Switch<TCases extends Case[]> =
    TCases extends []
    ? never
    : Head<TCases> extends Case<true, infer THEN>
      ? THEN
      : Switch<Tail<TCases>>;

export type Case<C extends boolean = any, T = any> = [C, T];
