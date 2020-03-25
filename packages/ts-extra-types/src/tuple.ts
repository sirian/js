import {MustBeArray, MustBeNumber} from "./mustbe";
import {Dec, Inc, Numbers} from "./number";
import {AnyKey, Expand, IsPartial, IsRequired, KeyOf, OmitIndexSignature, Partialize} from "./object";
import {IfNever, IsExact, IsFiniteNumber, IsWide} from "./types";

export type NonEmptyTuple<H = any, R extends any[] = any> = [H, ...R[]];

export type Head<T extends any[]> = T extends NonEmptyTuple<infer U> ? U : T[0] | undefined;

export type Tail<L extends any[]> = ((...t: L) => void) extends ((h: any, ...rest: infer R) => void) ? R : never;

export type ReplaceTail<T extends any[], L extends any[]> = Cons<Head<T>, L, T extends NonEmptyTuple ? false : true>;

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
    IsOpenTuple<L> extends true ? Array<ArrayValueOf<L>> :
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

export type Drop<L extends any[], K extends AnyKey, N extends number = 0> =
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
export type ArrayKey = keyof any[];
export type IsArray<T> = T extends any[] ? true : false;
export type IsFiniteTuple<T> = T extends any[] ? IsFiniteNumber<Length<T>> : false;
export type IsOpenTuple<T> = T extends any[] ? IsWide<Length<T>> : false;
export type IsEmptyTuple<T> = IsExact<T, []>;
export type IsRepeatedTuple<T> = IsExact<Required<T>, Array<ArrayValueOf<T>>>;

export type TupleKeyOf<T> = KeyOf<T, keyof Numbers>;
export type TupleIndex<T> = KeyOf<T, Numbers[keyof Numbers]>;

export type StripArray<T> =
    T extends any
    ? number extends Length<T>
      ? OmitArrayProto<T>
      : OmitIndexSignature<OmitArrayProto<T>>
    : never;

export type OmitArrayProto<T> = Omit<T, Exclude<ArrayKey, number>>;

export type StripTuple<T> = Pick<T, TupleKeyOf<T> | TupleIndex<T>>;

export type ObjectToArray<T, Len extends number = Length<T>> =
    StripArray<T> extends infer O
    ? Repeat<Len, O[keyof O]> & Expand<OmitIndexSignature<O>>
    : never;

// export type WrapTuple<T extends any[] & (number extends T["length"] ? never : unknown)> =
//     { length: T["length"] }
//     & { [K in keyof StripTuple<T>]: Box<T[K]> }
//     & Array<keyof StripTuple<T> extends infer K
//             ? K extends keyof T? Box<T[K]> : never
//             : never>;

export type ArrayValueOf<T> = T extends Array<infer U> ? U : never;

export type ValueOf<T> = T extends Array<infer U> ? U : T[keyof T];

export type TupleEntryOf<T extends any[]> = { [P in TupleKeyOf<T>]: [P, T[P]] }[TupleKeyOf<T>];

export type ArrayEntryOf<T extends any[]> =
    IsFiniteTuple<T> extends true
    ? TupleEntryOf<T>
    : TupleEntryOf<T> | [string, ArrayValueOf<T>];

export type DropRest<T extends any[]> =
    IsOpenTuple<T> extends false ? T :
    {
        0: []
        1: ReplaceTail<T, DropRest<Tail<T>>>;
    }[Required<T> extends NonEmptyTuple ? 1 : 0];

export type GetRest<T extends any[]> =
    {
        0: T
        1: GetRest<Tail<T>>;
    }[Required<T> extends [any, ...any[]] ? 1 : 0];

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
        0: ArrayValueOf<T>;
        1: LastElement<Tail<T>>;
    }[T extends [any, ...any[]] ? 1 : 0];

export type LastIndex<R extends any[]> = R extends [] ? unknown : Length<Tail<Required<R>>>;

export type IndexRange<N extends number, TMP extends number[] = []> =
    number extends N ? N :
    {
        0: ArrayValueOf<TMP>
        1: IndexRange<N, Cons<Length<TMP>, TMP>>;
    }[N extends Length<Partial<TMP>> ? 0 : 1];

export type KeyRange<N extends number, TMP extends any[] = []> =
    number extends N ? N :
    {
        0: Exclude<keyof TMP, ArrayKey>
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
    ? IfNever<K, [], SizedArray<N, T> & Expand<Partialize<Record<K, T>, N>>>
    : never;

export type UnionToTuple<U, T extends any[] = []> = {
    1: T;
    0: UnionToTupleRecursively_<T, U, U>;
}[IfNever<U, 1, 0>];

type UnionToTupleRecursively_<T extends any[], U, S> =
    S extends any ? UnionToTuple<Exclude<U, S>, Push<T, S>> : never;

export interface DeepArray<T> extends Array<T | DeepArray<T>> {

}
