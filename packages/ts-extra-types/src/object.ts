import {NumberToString, StringToNumber} from "./cast";
import {If, Not} from "./logic";
import {MustBeKey} from "./mustbe";
import {ElementOf, Length} from "./tuple";
import {IfExact, IfNever, IsExtends, IsWide, UnionToIntersection} from "./types";

export type KeyOf<T> = Extract<keyof T, string>;
export type SymbolOf<T> = Extract<keyof T, symbol>;
export type IndexOf<T> = { [P in keyof T]: If<IsWide<P>, never, P> }[Extract<keyof T, number>];
export type ValueOf<T, K extends keyof T = keyof T> = T[K];

export type Get<T, K extends keyof any, TDefault = never> =
    K extends keyof T ? T[K] :
    T extends { [P in K]: any } ? T[K] : TDefault;

export type MapKey<T, K extends keyof any> =
    { [P in keyof T]-?: Record<K, 0> extends Record<P, 0> ? P : never }[keyof T];

export type ExtractKey<T, K extends keyof any> = Extract<keyof T, MapKey<T, K>>;
export type ExcludeKey<T, K extends keyof any> = Exclude<keyof T, MapKey<T, K>>;

export type MyPick<T, K extends keyof any> = Pick<T, ExtractKey<T, K>>;
export type MyOmit<T, K extends keyof any> = IfNever<K, T, Pick<T, ExcludeKey<T, K>>>;
export type OmitIndexSignature<T> = Pick<T, ExcludeWide<keyof T>>;

export type EntryOf<T> = ObjectEntryOf<ToStringRecord<T>>;
export type ObjectEntryOf<T> = { [P in keyof T]-?: [P, T[P]] }[keyof T];

export type EntriesOf<T> = Array<EntryOf<T>>;

export type TypedKeyOf<T, Condition> = { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T];
export type Shrink<T, Condition> = MyPick<T, TypedKeyOf<T, Condition>>;

export type Rewrite<T> = { [P in keyof T]: T[P] };
export type Overwrite<T, U> = MyOmit<T, keyof U> & U;
export type Replace<T, U> = MyPick<Overwrite<T, U>, keyof T>;

export type ExcludeWide<T> = T extends any ? If<IsWide<T>, never, T> : never;

export type ToStringRecord<T> =
    T extends ArrayLike<any> ? _ArrayLikeToStringRecord<T> : _ToStringRecord<T>;

type _ArrayLikeToStringRecord<T extends ArrayLike<any>> =
    Omit<T, Exclude<keyof any[], number>> extends infer O
    ? number extends Length<T>
      ? _ToStringRecord<O>
      : _ToStringRecord<OmitIndexSignature<O>>
    : never;

export type GetIndexSignature<T, K extends number | string = number | string> =
    K extends any
    ? { [P in keyof T]: K extends P ? T[P] : never }[keyof T]
    : never;

type _ToStringRecord<T> =
    Omit<T, number>
    & Partialize<{ [P in ExcludeWide<NumberToString<IndexOf<Required<T>>>>]: Get<Required<T>, P> }, OptionalKeys<T>>
    & (number extends keyof T ? Record<string, GetIndexSignature<T>> : {});

export type ToNumberRecord<T> = _ToNumberRecord<ToStringRecord<T>>;

export type _ToNumberRecord<T> =
    Omit<T, string>
    & Partialize<{ [P in ExcludeWide<StringToNumber<KeyOf<Required<T>>>>]: Get<Required<T>, P> }, OptionalKeys<T>>
    & (string extends keyof T ? Record<number, GetIndexSignature<T>> : {});

export type MatchingKeys<T, U> = {
    [P in keyof (T | U)]-?: IfExact<MyPick<T, P>, MyPick<U, P>, P, never>;
}[keyof (T | U)];

export type OptionalKeys<T> = {
    [K in keyof T]-?: If<IsOptionalKey<T, K>, K>
}[keyof T];

export type RequiredKeys<T> = {
    [K in keyof T]-?: If<IsRequiredKey<T, K>, K>
}[keyof T];

export type IsOptionalKey<T, K extends keyof T> =
    IsExtends<true, { [P in K]: IsExtends<Partial<MyPick<T, P>>, MyPick<T, P>> }[K]>;

export type IsRequiredKey<T, K extends keyof T> = Not<IsOptionalKey<T, K>>;

export type IsRequired<T> = IsExtends<T, Required<T>>;
export type IsPartial<T> = IsExtends<Partial<T>, T>;

export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};

export type WritableKeys<T> = MatchingKeys<T, Writable<T>>;
export type ReadonlyKeys<T> = Exclude<keyof T, WritableKeys<T>>;

export type Require<T, K extends keyof any = keyof T> = Overwrite<T, Required<MyPick<T, K>>>;

export type Partialize<T, K extends keyof any = keyof T> = Overwrite<T, Partial<MyPick<T, K>>>;

export type Ensure<T, K extends keyof any, V = any> = T & {
    [P in K]: Extract<Get<T, P, V>, V>
};

export type FromEntry<E extends [any, any]> =
    E extends [MustBeKey<infer K>, infer V] ? Record<K, V> : never;

export type FromEntries<L extends Array<[any, any]>> =
    Length<L> extends 0 ? {} :
    UnionToIntersection<FromEntry<ElementOf<L>>>;

type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
export type Exclusive<T, U> =
    (T | U) extends any
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;
