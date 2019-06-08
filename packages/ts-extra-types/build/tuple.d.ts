import { Every, If } from "./logic";
import { MustBeArray, MustBeNumber } from "./mustbe";
import { IsPartial, IsRequired, Partialize, ToStringRecord } from "./object";
import { IfNever, IsExact, IsExtends, IsFiniteNumber, IsWide } from "./types";
export declare type FixArray<T> = T & {
    [Symbol.iterator]: any;
    [Symbol.unscopables]: any;
};
export declare type Fix<T, U> = T extends any[] ? FixArray<U> : U;
export declare type Head<T extends any[], D = T[0]> = T extends [infer R, ...any[]] ? R : D;
export declare type Tail<L extends any[]> = ((...t: L) => void) extends ((h: any, ...rest: infer R) => void) ? R : never;
export declare type Unshift<L extends any[], X> = ((x: X, ...t: L) => void) extends ((...t: infer R) => void) ? R : never;
export declare type Cons<X, L extends any[]> = Unshift<L, X>;
export declare type Push<L extends any[], T> = ((r: unknown, ...x: L) => void) extends ((...x: infer L2) => void) ? {
    [K in keyof L2]-?: K extends keyof L ? L[K] : T;
} : never;
export declare type Reverse<L extends any[]> = IsOpenTuple<L> extends true ? Array<ElementOf<L>> : IsPartial<L> extends true ? Partial<_Reverse<Required<L>>> : IsRequired<L> extends true ? _Reverse<L> : never;
declare type _Reverse<L extends any[]> = {
    0: L;
    1: Push<_Reverse<Tail<L>>, Head<L>>;
}[L extends [any, ...any[]] ? 1 : 0];
export declare type Concat<A extends any[], B extends any[]> = A extends [] ? B : {
    0: A;
    1: Concat<Push<A, Head<B>>, Tail<B>>;
}[B extends [] ? 0 : 1];
export declare type DropRight<N extends number, L extends any[]> = number extends N ? [] : number extends Length<L> ? L : Length<DropLeft<N, Required<L>>> extends MustBeNumber<infer NN> ? Take<NN, L> : never;
export declare type DropLast<L extends any[]> = DropRight<1, L>;
export declare type DropLeft<N extends number, L extends any[], TMP extends any[] = []> = {
    0: L;
    1: DropLeft<N, Tail<L>, Cons<any, TMP>>;
}[Length<TMP> extends N ? 0 : 1];
export declare type Slice<T extends any[], TStart extends number = 0, TLength extends number = Length<T>> = DropLeft<TStart, T> extends MustBeArray<infer R> ? Take<TLength, R> : never;
export declare type Take<N extends number, L extends any[], TMP extends any[] = []> = number extends N ? L : {
    0: TMP;
    1: Take<N, Tail<L>, Push<TMP, Head<L>>>;
}[Length<TMP> extends N ? 0 : IsEmptyTuple<L> extends true ? 0 : 1];
export declare type Length<T> = T extends {
    length: MustBeNumber<infer L>;
} ? L : never;
export declare type IsArray<T> = IsExtends<T, any[]>;
export declare type IsFiniteTuple<T> = Every<[IsArray<T>, IsFiniteNumber<Length<T>>]>;
export declare type IsOpenTuple<T> = Every<[IsArray<T>, IsWide<Length<T>>]>;
export declare type IsEmptyTuple<T> = Every<[IsArray<T>, IsExact<Length<T>, 0>]>;
export declare type IsRepeatedTuple<T> = Every<[IsArray<T>, IsExact<T, Array<ElementOf<T>>>]>;
export declare type TupleType<T extends any[]> = IsEmptyTuple<T> extends true ? "empty" : IsFiniteTuple<T> extends true ? "finite" : IsRepeatedTuple<T> extends true ? "repeated" : "open";
export declare type ElementOf<T> = T extends Array<infer U> ? U : never;
export declare type TupleEntryOf<T extends any[]> = {
    [P in TupleKey<T>]: [P, T[P]];
}[TupleKey<T>] | If<IsOpenTuple<T>, [string, ElementOf<GetRest<T>>]>;
export declare type DropRest<T extends any[]> = T extends [] ? T : {
    0: [];
    1: Cons<Head<T>, DropRest<Tail<T>>>;
}[IsRepeatedTuple<T> extends true ? 0 : 1];
export declare type GetRest<T extends any[]> = T extends [] ? T : {
    0: T;
    1: GetRest<Tail<T>>;
}[IsRepeatedTuple<T> extends true ? 0 : 1];
export declare type TupleKey<T extends any[]> = Exclude<keyof T, keyof any[]>;
export declare type Range<N, T extends number[] = [0]> = N extends number ? {
    0: Reverse<T>;
    1: Range<N, Cons<Length<T>, T>>;
}[Length<Tail<T>> extends N ? 0 : 1] : never;
export declare type LastElement<T extends any[]> = Required<T> extends [any] ? Head<T> : {
    0: ElementOf<T>;
    1: LastElement<Tail<T>>;
}[T extends [any, ...any[]] ? 1 : 0];
export declare type LastIndex<R extends any[]> = R extends [] ? unknown : Length<Tail<Required<R>>>;
export declare type IndexRange<N extends number, TMP extends number[] = []> = number extends N ? N : {
    0: ElementOf<TMP>;
    1: IndexRange<N, Cons<Length<TMP>, TMP>>;
}[N extends Length<Partial<TMP>> ? 0 : 1];
export declare type KeyRange<N extends number, TMP extends any[] = []> = number extends N ? N : {
    0: Exclude<keyof TMP, keyof any[]>;
    1: KeyRange<N, Cons<any, TMP>>;
}[N extends Length<Partial<TMP>> ? 0 : 1];
export interface PartialSizedArray<N extends number, T = any> extends Array<T | undefined> {
    length: N;
    0?: T;
}
export interface RequiredSizedArray<N extends number, T extends any = any> extends Array<T> {
    length: N;
    0: T;
}
export declare type SizedArray<N extends number, T = any> = number extends N ? T[] : 0 extends N ? PartialSizedArray<N, T> : RequiredSizedArray<N, UnionToTuple<N> extends [N] ? T : T | undefined>;
export declare type Repeat<N extends number, T = any> = number extends N ? T[] : IndexRange<N> extends MustBeNumber<infer K> ? IfNever<K, [], SizedArray<N, T> & Partialize<ToStringRecord<Record<K, T>>, N>> : never;
export declare type UnionToTuple<U, T extends any[] = []> = {
    1: T;
    0: UnionToTupleRecursively_<T, U, U>;
}[IfNever<U, 1, 0>];
declare type UnionToTupleRecursively_<T extends any[], U, S> = S extends any ? UnionToTuple<Exclude<U, S>, Push<T, S>> : never;
export {};
//# sourceMappingURL=tuple.d.ts.map