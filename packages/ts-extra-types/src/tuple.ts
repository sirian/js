import {If} from "./logic";
import {MustBeArray, MustBeNumber} from "./mustbe";
import {Dec, Inc} from "./number";
import {IsPartial, IsRequired, Partialize, ToStringRecord} from "./object";
import {IfNever, IsExact, IsFiniteNumber, IsWide} from "./types";

export type FixArray<T> = T & {
    [Symbol.iterator]: any;
    [Symbol.unscopables]: any;
};

export type Fix<T, U> = T extends any[] ? FixArray<U> : U;

export type Head<T extends any[], D = T[0]> = T extends [infer R, ...any[]] ? R : D;

export type Tail<L extends any[]> =
    ((...t: L) => void) extends ((h: any, ...rest: infer R) => void) ? R : never;

export type ReplaceTail<T extends any[], L extends any[]> = Cons<Head<T>, L, T extends [any, ...any[]] ? false : true>;

export type Cons<X, L extends any[], Optional extends boolean = false> =
    Optional extends true
    ? ((x?: X, ...t: L) => void) extends ((...t: infer R) => void) ? R : never
    : ((x: X, ...t: L) => void) extends ((...t: infer R) => void) ? R : never;

export type Push<L extends any[], T> =
    IsOpenTuple<L> extends true
    ? L
    : ((r: unknown, ...x: L) => void) extends ((...x: infer L2) => void)
      ? { [K in keyof L2]-?: K extends keyof L ? L[K] : T }
      : never;

export type Reverse<L extends any[]> =
    IsOpenTuple<L> extends true ? Array<ElementOf<L>> :
    IsPartial<L> extends true ? Partial<_Reverse<Required<L>>> :
    IsRequired<L> extends true ? _Reverse<L> :
    never;

type _Reverse<L extends any[]> = {
    0: L
    1: Push<_Reverse<Tail<L>>, Head<L>>,
}[L extends [any, ...any[]] ? 1 : 0];

export type Concat<A extends any[], B extends any[]> =
    IsEmptyTuple<A> extends true ? B :
    {
        0: A,
        1: Concat<Push<A, Head<B>>, Tail<B>>,
    }[IsEmptyTuple<B> extends true ? 0 : 1];

export type DropTail<L extends any[]> =
    IsEmptyTuple<L> extends true ? [] :
    L extends [any, ...any[]] ? [Head<L>] : [Head<L>?];

export type DropRight<N extends number, L extends any[]> =
    number extends N ? [] :
    number extends Length<L> ? L :
    Length<DropLeft<N, Required<L>>> extends MustBeNumber<infer NN> ? Take<NN, L> : never;

export type DropLast<L extends any[]> = DropRight<1, L>;
export type DropLeft<N extends number, L extends any[], TMP extends any[] = []> = {
    0: L,
    1: DropLeft<N, Tail<L>, Cons<any, TMP>>,
}[Length<TMP> extends N ? 0 : 1];

export type Drop<L extends any[], K extends keyof any, N extends number = 0> =
    number extends K ? [] :
    IsRepeatedTuple<L> extends true ? L :
    {
        0: []
        1: Drop<Tail<L>, K, Inc<N>> extends MustBeArray<infer R>
           ? [N] extends [K]
             ? R
             : ReplaceTail<L, R>
           : never;
    }[IsEmptyTuple<L> extends true ? 0 : 1];

export type Slice<T extends any[], TStart extends number = 0, TLength extends number = Length<T>> =
    DropLeft<TStart, T> extends MustBeArray<infer R> ? Take<TLength, R> : never;

export type Take<N extends number, L extends any[]> =
    number extends N ? L :
    IsEmptyTuple<L> extends true ? [] :
    {
        0: []
        1: ReplaceTail<L, Take<Dec<N>, Tail<L>>>;
    }[N extends 0 ? 0 : 1];

export type Length<T> = T extends { length: MustBeNumber<infer L> } ? L : never;

export type IsArray<T> = T extends any[] ? true : false;
export type IsFiniteTuple<T> = T extends any[] ? IsFiniteNumber<Length<T>> : false;
export type IsOpenTuple<T> = T extends any[] ? IsWide<Length<T>> : false;
export type IsEmptyTuple<T> = T extends any[] ? IsExact<Length<Required<T>>, 0> : false;
export type IsRepeatedTuple<T> = IsExact<Required<T>, Array<ElementOf<T>>>;

export type ElementOf<T> = T extends Array<infer U> ? U : never;

export type TupleEntryOf<T extends any[]> =
    { [P in TupleKey<T>]: [P, T[P]] }[TupleKey<T>] |
    If<IsOpenTuple<T>, [string, ElementOf<GetRest<T>>]>;

export type DropRest<T extends any[]> =
    IsOpenTuple<T> extends false ? T :
    {
        0: []
        1: ReplaceTail<T, DropRest<Tail<T>>>;
    }[Required<T> extends [any, ...any[]] ? 1 : 0];

export type GetRest<T extends any[]> =
    {
        0: T
        1: GetRest<Tail<T>>;
    }[Required<T> extends [any, ...any[]] ? 1 : 0];

export type TupleKey<T extends any[]> = Exclude<keyof T, keyof any[]>;

export type Range<N, T extends number[] = [0]> =
    N extends number
    ? {
        0: Reverse<T>,
        1: Range<N, Cons<Length<T>, T>>,
    }[Length<Tail<T>> extends N ? 0 : 1]
    : never;

export type LastElement<T extends any[]> =
    Required<T> extends [any] ? Head<T> :
    {
        0: ElementOf<T>;
        1: LastElement<Tail<T>>;
    }[T extends [any, ...any[]] ? 1 : 0];

export type LastIndex<R extends any[]> = R extends [] ? unknown : Length<Tail<Required<R>>>;

export type IndexRange<N extends number, TMP extends number[] = []> =
    number extends N ? N :
    {
        0: ElementOf<TMP>
        1: IndexRange<N, Cons<Length<TMP>, TMP>>;
    }[N extends Length<Partial<TMP>> ? 0 : 1];

export type KeyRange<N extends number, TMP extends any[] = []> =
    number extends N ? N :
    {
        0: Exclude<keyof TMP, keyof any[]>
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

export type SizedArray<N extends number, T = any> =
    number extends N ? T[] :
    0 extends N
    ? PartialSizedArray<N, T>
    : RequiredSizedArray<N, UnionToTuple<N> extends [N] ? T : T | undefined>;

export type Repeat<N extends number, T = any> =
    number extends N ? T[] :
    IndexRange<N> extends MustBeNumber<infer K>
    ? IfNever<K, [], SizedArray<N, T> & Partialize<ToStringRecord<Record<K, T>>, N>>
    : never;

export type UnionToTuple<U, T extends any[] = []> = {
    1: T;
    0: UnionToTupleRecursively_<T, U, U>;
}[IfNever<U, 1, 0>];

type UnionToTupleRecursively_<T extends any[], U, S> =
    S extends any ? UnionToTuple<Exclude<U, S>, Push<T, S>> : never;

export interface DeepArray<T> extends Array<T | DeepArray<T>> {

}
