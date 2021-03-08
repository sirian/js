import {Lengthwise} from "./interfaces";
import {Dec, Decs} from "./number";
import {KeyOf} from "./object";
import {IfNever, IsExact, IsExtends, IsFiniteNumber, IsWide} from "./types";

export type ArrayRO<T = unknown> = readonly T[];
export type ArrayRW<T = unknown> = T[];

export type Head<T extends ArrayRO> = T extends readonly [infer H, ...any] ? H : T[0] | undefined;

export type Tail<L extends ArrayRO> =
    L extends readonly [] ? L :
    L extends [any?, ...infer U1] ? U1 :
    L extends readonly [any?, ...infer U2] ? Readonly<U2> :
    never;

export type ReplaceTail<T extends ArrayRO, L extends ArrayRO> =
    T extends readonly [] ? L :
    T extends [infer H1, ...any] ? [H1, ...L] :
    T extends readonly [infer H2, ...any] ? readonly [H2, ...L] :
    T extends [(infer H3)?, ...any] ? [H3?, ...L] :
    T extends readonly [(infer H4)?, ...any] ? readonly [H4?, ...L] :
    never;

export type Reverse<L extends ArrayRO> =
    L extends { length: 1 | 0 } ? L :
    IsOpenTuple<L> extends true ? [...GetRest<L>, ...Reverse<DropRest<L>>] :
    L extends [infer A1, ...infer B1, infer C1] ? [C1, ...Reverse<B1>, A1] :
    L extends [infer A2, ...infer B2, (infer C2)?] ? [C2 | undefined, ...Reverse<B2>, A2] :
    L extends [(infer A3)?, ...infer B3, (infer C3)?] ? [C3?, ...Reverse<B3>, A3?] :
    never;

export type LastElement<T extends ArrayRO> =
    T extends [] ? undefined :
    IsFiniteTuple<T> extends true ? [undefined, ...T][Length<T>] :
    LastElement<DropRest<T>> | GetRest<T>[number];

export type DropLast<L extends ArrayRO> =
    L extends readonly [] ? L :
    IsOpenTuple<L> extends true ? L :
    L extends ([...infer R, any] | [...infer R, any?]) ? R :
    L;

export type DropLeft<N extends number, L extends ArrayRO> =
    N extends 0 ? L :
    L extends [] ? [] :
    number extends N ? [] :
    DropLeft<Dec<N>, Tail<L>>;

export type Splice<L extends ArrayRO, TStart extends number, TDelCount extends number = 1, TItems extends any[] = []> =
    [
        ...Take<TStart, L>,
        ...TItems,
        ...DropLeft<TDelCount, DropLeft<TStart, L>>
    ];

export type Slice<T extends ArrayRO, TStart extends number = 0, TLength extends number = Length<T>> =
    Take<TLength, DropLeft<TStart, T>>;

export type Take<N extends number, L extends ArrayRO> =
    N extends 0 ? [] :
    L extends [] ? L :
    number extends N ? L :
    ReplaceTail<L, Take<Dec<N>, Tail<L>>>;

export type Length<T> = T extends Lengthwise<infer L> ? L : never;
export type IsArray<T> = IsExtends<T, ArrayRO>;
export type IsFiniteTuple<T> = T extends ArrayRO ? IsFiniteNumber<Length<T>> : false;
export type IsOpenTuple<T> = T extends ArrayRO ? IsWide<Length<T>> : false;
export type IsEmptyTuple<T> = IsExtends<T, []>;
export type IsRepeatedTuple<T> =
    T extends Array<infer V2> ? IsExact<T, V2[]> :
    T extends ArrayRO<infer V1> ? IsExact<T, ArrayRO<V1>> :
    false;

export type TupleKeyOf<T> = KeyOf<T, `${number}`>;

export type TupleGet<T extends ArrayRO, N extends number> =
    number extends N ? T[N] :
    N extends 0 ? Head<T> : TupleGet<Tail<T>, Dec<N>>;

export type TupleToObject<T extends ArrayRO> = Pick<T, TupleKeyOf<T>>;

export type ArrayToObject<T extends ArrayRO> =
    number extends Length<T>
      ? TupleToObject<T> & Pick<T, number>
      : TupleToObject<T>;

export type DropRest<T extends ArrayRO> =
    T extends readonly [] ? T :
    IsRepeatedTuple<T> extends true ? [] :
    ReplaceTail<T, DropRest<Tail<T>>>;

export type GetRest<T extends ArrayRO> =
    T extends [] ? [] :
    IsRepeatedTuple<T> extends true ? T :
    GetRest<Tail<T>>;

export type Range<N extends number> =
    N extends 0 ? [0] :
    number extends N ? number[] :
    [...Range<Dec<N>>, N];

export type IterableToArray<T extends Iterable<any>> =
    T extends Iterable<infer V> ? V[] : never;

export type UnionToTuple<U, T extends ArrayRO = []> =
    IfNever<U, T, _UnionToTuple<T, U, U>>;

type _UnionToTuple<T extends ArrayRO, U, S> =
    S extends any ? UnionToTuple<Exclude<U, S>, [...T, S]> : never;

export type DeepArray<T> = Array<T | DeepArray<T>>;

export type Flatten<T extends ArrayRO> =
    T extends ArrayRW
    ? Array<_Flatten<T>>
    : ArrayRO<_Flatten<T>>;

type _Flatten<T> = T extends ArrayRO<infer U> ? _Flatten<U> : T;

export type TupleOf<T, N extends number> =
    N extends 0 ? [] :
    N extends Decs ? [T, ...TupleOf<T, Dec<N>>] :
    T[];
