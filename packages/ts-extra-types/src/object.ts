import {KeyToNumber, KeyToString} from "./cast";
import {If} from "./logic";
import {MustBe, MustBeString} from "./mustbe";
import {ArrayRO, ArrayToObject, IsOpenTuple, Length, Tail, TupleKeyOf} from "./tuple";
import {AnyFunc, IfExact, IfNever, IsExact, IsExtends, IsWide, UnionToIntersection, Writable} from "./types";

export type KeyOf<T, Filter = keyof T> = Extract<keyof T, Filter>;

export type AnyKey = keyof any;

export type ObjectTag<T> =
    T extends null ? "Null" :
    T extends undefined | void ? "Undefined" :
    T extends symbol ? "Symbol" :
    T extends { [Symbol.toStringTag]: MustBeString<infer R> } ? R :
    T extends ArrayRO ? "Array" :
    T extends number ? "Number" :
    T extends IArguments ? "Arguments" :
    T extends AnyFunc ? "Function" :
    T extends Error ? "Error" :
    T extends boolean ? "Boolean" :
    T extends number ? "Number" :
    T extends bigint ? "BigInt" :
    T extends string ? "String" :
    T extends Date ? "Date" :
    T extends RegExp ? "RegExp" :
    "Object";

export type ExtractByObjectTag<T, Type extends string> =
    T extends any
    ? ObjectTag<T> extends Type ? T : never
    : never;

export type BuiltinObjTagMap = {
    Undefined: undefined | void,
    Null: null;
    Array: any[];
    Arguments: IArguments;
    Function: AnyFunc;
    Error: Error;
    Boolean: Boolean | boolean;
    Number: Number | number;
    String: String | string;
    BigInt: BigInt | bigint;
    Date: Date;
    RegExp: RegExp;
};

export type ObjKeyOf<T> =
    T extends ArrayRO
    ? TupleKeyOf<T> | If<IsOpenTuple<T>, `${number}`>
    : KeyToString<KeyOf<T>>;

export type ObjValueOf<T> =
    T extends ArrayRO<infer V> ? V : T[keyof T];

export type ObjEntryOf<T> =
    T extends ArrayRO
    ? ObjEntryOf<ArrayToObject<T>>
    : { [P in KeyOf<T>]: Entry<KeyToString<P>, T[P]> }[KeyOf<T>];

export type Get<T, K extends AnyKey, TDefault = never> =
    K extends keyof T ? T[K] :
    T extends Record<K, infer V1> ? V1 :
    Required<T> extends Record<K, infer V2> ? V2 | undefined :
    TDefault;

export type GetDeep<T, L extends AnyKey[]> =
    L extends [] ? T :
    number extends Length<L> ? unknown :
    GetDeep<Get<T, L[0]>, Tail<L>>;

export type ExpandKey<K extends AnyKey> =
    number extends K ? K :
    string extends K ? K :
    K | KeyToNumber<K> | KeyToString<K>;

export type Expand<T> = { [P in ExpandKey<keyof T>]?: unknown } & T;

export type MyPick<T, K extends AnyKey> = Pick<T, KeyOf<T, ExpandKey<K>>>;
export type MyOmit<T, K extends AnyKey> = IfNever<K, T, Pick<T, Exclude<keyof T, ExpandKey<K>>>>;

export type ExactTypedKeyOf<T, Condition> = { [K in keyof T]: IsExact<T[K], Condition> extends true ? K : never }[keyof T];
export type TypedKeyOf<T, Condition> = { [K in keyof T]: T[K] extends Condition ? K : never }[keyof T];
export type PickTyped<T, Condition> = Pick<T, TypedKeyOf<T, Condition>>;
export type OmitTyped<T, Condition> = Omit<T, TypedKeyOf<T, Condition>>;

export type GetIndexSignature<T, K extends string | number = string | number> = Pick<T, Extract<K, KeyOf<T>>>;
export type OmitIndexSignature<T> = Pick<T, ExcludeWide<keyof T>>;
export type OmitNever<T> = OmitTyped<T, never>;

export type Overwrite<T, U> = MyOmit<T, keyof U> & U;
export type Replace<T, U> = MyPick<Overwrite<T, U>, keyof T>;
export type KeyExtract<T, K extends keyof T, U> = { [P in keyof T]: P extends K ? Extract<T[P], U> : T[P] };

export type ExcludeWide<T> =
    T extends any ? If<IsWide<T>, never, T> : never;

export type MatchingKeys<T, U> = _MatchingKeys<T, U> & _MatchingKeys<U, T>;

export type _MatchingKeys<T, U> = {
    [P in KeyOf<T>]-?:
    IfExact<Pick<T, P>, Pick<U, KeyOf<U, P>>, P>
}[KeyOf<T>];

export type OptionalKeys<T> = {
    [K in keyof T]-?: If<IsOptionalKey<T, K>, K>
}[keyof T];

export type RequiredKeys<T> = {
    [K in keyof T]-?: If<IsRequiredKey<T, K>, K>
}[keyof T];

export type IsOptionalKey<T, K extends keyof T> = IsPartial<MyPick<T, K>>;

export type IsRequiredKey<T, K extends keyof T> = IsRequired<MyPick<T, K>>;

export type IsRequired<T> = IsExtends<T, Required<T>>;
export type IsPartial<T> = IsExtends<Partial<T>, T>;

export type ReadonlyKeys<T> = Exclude<KeyOf<T>, WritableKeys<T>>;
export type WritableKeys<T> = {
    [P in KeyOf<T>]-?: IfExact<Pick<Required<T>, P>, Writable<Pick<Required<T>, P>>, P>
}[KeyOf<T>];

export type Require<T, K extends AnyKey = keyof T> = Overwrite<T, Required<MyPick<T, K>>>;

export type Partialize<T, K extends AnyKey = keyof T> = Overwrite<T, Partial<MyPick<T, K>>>;

export type Ensure<T, K extends AnyKey, U = unknown> = T & { [P in K]: U };

export type Entry<K extends AnyKey = any, V = any> = readonly [K, V];

export type FromEntry<E extends Entry> =
    UnionToIntersection<E extends Entry ? Record<E[0], E[1]> : never>;

export type FromEntries<L extends Iterable<Entry>> =
    L extends readonly [] ? {} :
    L extends Iterable<MustBe<infer V, Entry>> ? FromEntry<V> : never;

export type Exclusive<T, U> =
    (T | U) extends any
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

export type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };

export type ObjectZip<T extends ArrayRO, V extends ArrayRO> =
    T extends [] ? {} :
    T extends [any, ...infer R] ? FromEntry<[T[0], V[0]]> & ObjectZip<R, Tail<V>> :
    FromEntry<[T[number], V[number]]>;

export type Assign<T, S extends ArrayRO> =
    S extends readonly [] ? T :
    S extends readonly [infer H, ...infer R] ? Assign<Overwrite<T, H>, R> :
    Overwrite<T, S[number]>;
