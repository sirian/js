import {KeyToNumber, KeyToString} from "./cast";
import {If, Not} from "./logic";
import {ArrayValueOf, IsEmptyTuple, IsOpenTuple, NonEmptyTuple, Tail, TupleKeyOf} from "./tuple";
import {IfExact, IfNever, IsExtends, IsWide} from "./types";

export type KeyOf<T, Filter = any> = Extract<keyof Required<T>, Filter>;
export type EntryOf<T> = { [P in keyof T]-?: [P, T[P]] }[keyof T];

export type ObjKeyOf<T> =
    T extends any[] ? TupleKeyOf<T> | If<IsOpenTuple<T>, string> :
    {
        [P in keyof T]-?:
        P extends string ? P :
        P extends number ? KeyToString<P> :
        never;
    }[keyof T];

export type ObjValueOf<T> =
    T extends any[] ? ArrayValueOf<T> : T[keyof T];

export type ObjEntryOf<T> =
    T extends any[]
    ? { [P in KeyOf<T>]: [P, T[P]] }[TupleKeyOf<T>]
    : { [P in KeyOf<T>]: [KeyToString<P>, T[P]] }[KeyOf<T, string | number>];

export type Get<T, K extends keyof any, TDefault = never> =
    K extends keyof T ? T[K] :
    [T] extends [{ [P in K]: infer V }] ? V : TDefault;

export type Has<T, K extends keyof any> = K extends keyof T ? true : IsExtends<T, { [P in K]: any }>;

export type GetDeep<T, L extends PropertyKey[], D = never> =
    {
        0: T
        1: Has<T, L[0]> extends true
           ? GetDeep<Get<T, L[0]>, Tail<L>, D>
           : D;
    }[L extends [any, ...any[]] ? 1 : 0];

export type ExpandKey<K extends keyof any> = K | ExcludeWide<KeyToString<K>> | ExcludeWide<KeyToNumber<K>>;
export type Expand<T> = { [P in ExpandKey<keyof T>]?: unknown } & T;

export type MyPick<T, K extends keyof any> = Pick<T, Extract<keyof T, ExpandKey<K>>>;
export type MyOmit<T, K extends keyof any> = IfNever<K, T, Pick<T, Exclude<keyof T, ExpandKey<K>>>>;

export type TypedKeyOf<T, Condition> = { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T];
export type PickTyped<T, Condition> = Pick<T, TypedKeyOf<T, Condition>>;
export type OmitTyped<T, Condition> = Omit<T, TypedKeyOf<T, Condition>>;

export type GetIndexSignature<T, K extends string | number = string | number> = Pick<T, Extract<K, KeyOf<T>>>;
export type OmitIndexSignature<T> = Pick<T, ExcludeWide<keyof T>>;
export type OmitNever<T> = OmitTyped<T, never>;

export type Rewrite<T> = { [P in keyof T]: T[P] };
export type Overwrite<T, U> = MyOmit<T, keyof U> & U;
export type Replace<T, U> = MyPick<Overwrite<T, U>, keyof T>;

export type ExcludeWide<T> = T extends any ? If<IsWide<T>, never, T> : never;

// ? Omit<T, number>
//     & {[P in NumberToString<Extract<OptionalKeys<O>, number>>]?: Get<T, P>}
//     & {[P in NumberToString<Extract<RequiredKeys<O>, number>>]: Get<T, P>}
// & Partialize<{ [P in NumberToString<NumberKeyOf<T>>]: Get<Required<T>, P}, >
// & (number extends keyof T ? { [id: string]: GetIndexSignature<T> } : {});

export type MatchingKeys<T, U> = _MatchingKeys<T, U> & _MatchingKeys<U, T>;

export type _MatchingKeys<T, U> = {
    [P in KeyOf<T>]-?:
    IfExact<Pick<T, P>, Pick<U, Extract<keyof U, P>>, P>
}[KeyOf<T>];

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

export type WritableKeys<T> = Exclude<KeyOf<T>, ReadonlyKeys<T>>;
export type ReadonlyKeys<T> = {
    [P in KeyOf<T>]-?: Pick<Required<T>, P> extends infer O ? IfExact<Writable<O>, O, never, P> : never
}[KeyOf<T>];

export type Require<T, K extends keyof any = keyof T> = Overwrite<T, Required<MyPick<T, K>>>;

export type Partialize<T, K extends keyof any = keyof T> = Overwrite<T, Partial<MyPick<T, K>>>;

export type Ensure<T, K extends keyof any> = { [P in K]: unknown } & T;

export type Entry<K extends PropertyKey = any, V = any> = [K, V];

export type FromEntry<E extends Entry> =
    E extends Entry<infer K, infer V> ? Record<K, V> : never;

export type FromEntries<L extends Entry[]> =
    {
        0: If<IsEmptyTuple<L>, {}, FromEntry<ArrayValueOf<L>>>;
        1: FromEntry<L[0]> & FromEntries<Tail<L>>;
    }[L extends NonEmptyTuple ? 1 : 0];

type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };
export type Exclusive<T, U> =
    (T | U) extends any
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

export type ObjectZip<K extends PropertyKey[], V extends any[]> =
    IsEmptyTuple<K> extends true ? {} :
    {
        0: Record<K[number], V[number]>;
        1: (V extends NonEmptyTuple ? Record<K[0], V[0]> : Partial<Record<K[0], V[0]>>)
            & ObjectZip<Tail<K>, Tail<V>>
    }[K extends NonEmptyTuple ? 1 : 0];

export type Assign<T, S extends any[]> =
    {
        0: T
        1: Assign<Overwrite<T, S[0]>, Tail<S>>,
    }[S extends NonEmptyTuple ? 1 : 0];
