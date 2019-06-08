import { Ctor, Func } from "./function";
import { ElementOf, Head, Tail } from "./tuple";
export declare type If<C extends boolean, T, F = never, D = never> = boolean extends C ? D : C extends true ? T : F;
export declare type AsType<T, U> = T extends U ? T : never;
export declare type AsArray<X> = AsType<X, any[]>;
export declare type AsFunc<X> = AsType<X, Func>;
export declare type AsCtor<X> = AsType<X, Ctor>;
export declare type AsObject<X> = AsType<X, object>;
export declare type IfTrue<C extends boolean, T, F = never> = If<C, T, F>;
export declare type IfFalse<C extends boolean, T, F = never> = If<Not<C>, T, F>;
export declare type Every<T extends boolean[]> = T extends [] ? true : {
    0: ElementOf<T>;
    1: And<Head<T>, Every<Tail<T>>>;
}[T extends [any, ...any[]] ? 1 : 0];
export declare type Some<T extends boolean[]> = T extends [] ? false : {
    0: ElementOf<T>;
    1: Or<Head<T>, Some<Tail<T>>>;
}[T extends [any, ...any[]] ? 1 : 0];
export declare type Not<C extends boolean> = C extends true ? false : true;
export declare type And<A extends boolean, B extends boolean> = A extends true ? B : false;
export declare type Or<A extends boolean, B extends boolean> = A extends true ? true : B;
export declare type Xor<A extends boolean, B extends boolean> = If<A, Not<B>, B>;
export declare type Switch<TCases extends Case[]> = {
    0: never;
    1: Head<TCases> extends Case<true, infer THEN> ? THEN : Switch<Tail<TCases>>;
}[TCases extends [] ? 0 : 1];
export declare type Case<C extends boolean = any, T = any> = [C, T];
//# sourceMappingURL=logic.d.ts.map