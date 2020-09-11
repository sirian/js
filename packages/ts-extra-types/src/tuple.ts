import {KeyToNumber} from "./cast";
import {Lengthwise} from "./interfaces";
import {MustBeArray} from "./mustbe";
import {Add, Dec, Numbers} from "./number";
import {KeyOf, OmitIndexSignature} from "./object";
import {IfNever, IsExact, IsExtends, IsFiniteNumber, IsWide} from "./types";

export type ArrayRO<T = unknown> = readonly T[];
export type ArrayRW<T = unknown> = T[];

export type Tuple<H = any, R extends ArrayRO = any> = [H, ...R];

export type Head<T extends ArrayRO> = T extends Tuple<infer H> ? H : T[0] | undefined;

export type Tail<L extends ArrayRO> =
    L extends [] ? [] :
    L extends [any, ...infer U1] | [any?, ...infer U1] ? U1 :
    never;

export type ReplaceTail<T extends ArrayRO, L extends ArrayRO> =
    T extends [] ? [...L] :
    T extends [infer H1, ...any[]] ? [H1, ...L] :
    T extends [(infer H2)?, ...any[]] ? [H2?, ...L] :
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
    L extends [] ? [] :
    number extends Length<L>
    ? Array<ArrayValueOf<L>>
    : _Reverse<L>;

type _Reverse<L extends ArrayRO, TMP extends ArrayRO = []> =
    L extends [] ? TMP : _Reverse<Tail<L>, ReplaceTail<L, TMP>>;

export type Concat<A extends ArrayRO, B extends ArrayRO> = [...A, ...B];

export type LastElement<T extends ArrayRO> =
    T extends [] ? undefined :
    T extends ([...infer _, infer U] | [...infer _, (infer U)?]) ? U :
    undefined;

export type DropLast<L extends ArrayRO> =
    L extends [] ? [] :
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
    ReplaceTail<L, Take<Dec<N>, Tail<L>>>;

export type Length<T> = T extends Lengthwise<infer L> ? L : never;
export type IsArray<T> = IsExtends<T, ArrayRO>;
export type IsFiniteTuple<T> = T extends ArrayRO ? IsFiniteNumber<Length<T>> : false;
export type IsOpenTuple<T> = T extends ArrayRO ? IsWide<Length<T>> : false;
export type IsEmptyTuple<T> = IsExact<T, []>;
export type IsRepeatedTuple<T> = IsExact<Required<T>, Array<ArrayValueOf<T>>>;

export type TupleKeyOf<T> = KeyOf<T, keyof Numbers>;
export type TupleIndex<T> = KeyOf<T, Numbers[keyof Numbers]>;
export type TupleGet<T extends ArrayRO, N extends number> =
    N extends 0 ? Head<T> :
    number extends N ? ArrayValueOf<T> :
    TupleGet<Tail<T>, Dec<N>>;

export type ArrayToObject<T> =
    T extends ArrayRO & Lengthwise<infer N>
    ? number extends N
      ? OmitArrayProto<T>
      : OmitIndexSignature<OmitArrayProto<T>>
    : T;

export type OmitArrayProto<T> = Omit<T, Exclude<keyof any[], number>>;

export type StripTuple<T> = Pick<T, TupleKeyOf<T> | TupleIndex<T>>;

// export type WrapTuple<T extends AnyArray & (number extends T["length"] ? never : unknown)> =
//     { length: T["length"] }
//     & { [K in keyof StripTuple<T>]: Box<T[K]> }
//     & Array<keyof StripTuple<T> extends infer K
//             ? K extends keyof T? Box<T[K]> : never
//             : never>;

export type ArrayValueOf<T> = T extends Array<infer U> ? U : never;

export type ValueOf<T> = T extends Array<infer U> ? U : T[keyof T];

export type TupleEntryOf<T extends ArrayRO> = { [P in TupleKeyOf<T>]: [P, T[P]] }[TupleKeyOf<T>];

export type ArrayEntryOf<T extends ArrayRO> =
    IsFiniteTuple<T> extends true
    ? TupleEntryOf<T>
    : TupleEntryOf<T> | [string, ArrayValueOf<T>];

export type DropRest<T extends ArrayRO> =
    T extends [] ? [] :
    IsRepeatedTuple<T> extends true ? [] :
    ReplaceTail<T, DropRest<Tail<T>>>;

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
