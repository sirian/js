import {KeyToNumber} from "./cast";
import {Lengthwise} from "./interfaces";
import {MustBeArray} from "./mustbe";
import {Add, Dec, INumber, SNumber} from "./number";
import {KeyOf, ObjEntryOf, OmitIndexSignature} from "./object";
import {IfNever, IsExact, IsExtends, IsFiniteNumber, IsWide} from "./types";

export type ArrayRO<T = unknown> = readonly T[];
export type ArrayRW<T = unknown> = T[];

export type Tuple<H = any, R extends ArrayRO = any> = [H, ...R];

export type Head<T extends ArrayRO> = T extends [infer H, ...any] ? H : T[0] | undefined;

export type Tail<L extends ArrayRO> =
    L extends [] ? [] :
    L extends [any?, ...infer U1] ? U1 : never;

export type ReplaceTail<T extends ArrayRO, L extends ArrayRO> =
    T extends [] ? L :
    T extends [infer H1, ...any] ? [H1, ...L] :
    T extends [(infer H2)?, ...any] ? [H2?, ...L] :
    never;

export type Cons<X, L extends ArrayRO, Optional extends boolean = false> =
    Optional extends true
    ? [X?, ...L]
    : [X, ...L];

export type Push<L extends ArrayRO, T, Optional extends boolean = false> =
    Optional extends true
    ? [...L, T?]
    : [...L, T];

export type Reverse<L extends ArrayRO> =
    L extends { length: 1 | 0 } ? L :
    IsOpenTuple<L> extends true ? [...GetRest<L>, ...Reverse<DropRest<L>>] :
    L extends [infer A1, ...infer B1, infer C1] ? [C1, ...Reverse<B1>, A1] :
    L extends [infer A2, ...infer B2, (infer C2)?] ? [C2 | undefined, ...Reverse<B2>, A2] :
    L extends [(infer A3)?, ...infer B3, (infer C3)?] ? [C3?, ...Reverse<B3>, A3?] :
    never;

export type Concat<A extends ArrayRO, B extends ArrayRO> = [...A, ...B];

export type LastElement<T extends ArrayRO> =
    T extends [] ? undefined :
    number extends T["length"] ? LastElement<DropRest<T>> | ArrayValueOf<GetRest<T>> :
    [undefined, ...T][Length<T>];

export type DropLast<L extends ArrayRO> =
    L extends [] ? [] :
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
        ...DropLeft<Add<TStart, TDelCount>, L>
    ];

export type Slice<T extends ArrayRO, TStart extends number = 0, TLength extends number = Length<T>> =
    DropLeft<TStart, T> extends MustBeArray<infer R> ? Take<TLength, R> : never;

export type Take<N extends number, L extends ArrayRO> =
    N extends 0 ? [] :
    L extends [] ? L :
    number extends N ? L :
    L extends [infer A1, ...infer B1] ? [A1, ...Take<Dec<N>, B1>] :
    L extends [(infer A2)?, ...infer B2] ? [A2?, ...Take<Dec<N>, B2>] :
    never;

export type Length<T> = T extends Lengthwise<infer L> ? L : never;
export type IsArray<T> = IsExtends<T, ArrayRO>;
export type IsFiniteTuple<T> = T extends ArrayRO ? IsFiniteNumber<Length<T>> : false;
export type IsOpenTuple<T> = T extends ArrayRO ? IsWide<Length<T>> : false;
export type IsEmptyTuple<T> = IsExtends<T, []>;
export type IsRepeatedTuple<T> = T extends ArrayRO<infer V> ? IsExact<T, V[]> : false;

export type TupleKeyOf<T> = KeyOf<T, SNumber>;
export type TupleIndex<T> = KeyOf<T, INumber>;

export type TupleGet<T extends ArrayRO, N extends number> =
    N extends 0 ? Head<T> :
    number extends N ? T[number] :
    TupleGet<Tail<T>, Dec<N>>;

export type ArrayToObject<T> =
    T extends ArrayRO
    ? number extends Length<T>
      ? OmitArrayProto<T>
      : OmitIndexSignature<OmitArrayProto<T>>
    : T;

export type OmitArrayProto<T> = Omit<T, Exclude<keyof any[], number>>;

export type StripTuple<T> = Pick<T, TupleKeyOf<T> | TupleIndex<T>>;

export type ArrayValueOf<T> = T extends ArrayRO ? T[number] : never;

export type ValueOf<T> = T extends ArrayRO<infer U> ? U : T[keyof T];

export type TupleEntryOf<T extends ArrayRO> = ObjEntryOf<StripTuple<T>>;

export type ArrayEntryOf<T extends ArrayRO> =
    IsFiniteTuple<T> extends true
    ? TupleEntryOf<T>
    : TupleEntryOf<T> | [string, T[number]];

export type DropRest<T extends ArrayRO> =
    T extends [] ? [] :
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

export type LastIndex<R extends ArrayRO> =
    R extends [] ? unknown : Length<Tail<Required<R>>>;

export type IndexRange<N extends number> = KeyToNumber<KeyRange<N>>;

export type KeyRange<N extends number> = N extends N ? TupleKeyOf<TupleOf<void, N>> : never;

export type UnionToTuple<U, T extends ArrayRO = []> =
    IfNever<U, T, _UnionToTuple<T, U, U>>;

type _UnionToTuple<T extends ArrayRO, U, S> =
    S extends any ? UnionToTuple<Exclude<U, S>, Push<T, S>> : never;

export type DeepArray<T> = Array<T | DeepArray<T>>;

export type Flatten<T extends ArrayRO> =
    T extends ArrayRW
    ? Array<_Flatten<T>>
    : ArrayRO<_Flatten<T>>;

type _Flatten<T> = T extends ArrayRO<infer U> ? _Flatten<U> : T;

export type TupleOf<T, N extends number> =
    N extends 0 ? [] :
    number extends N ? T[] :
    [T, ...TupleOf<T, Dec<N>>];
