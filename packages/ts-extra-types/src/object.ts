import {KeyToNumber, KeyToString} from "./cast";
import {If} from "./logic";
import {MustBe, MustBeString} from "./mustbe";
import {ArrayRO, Head, IsOpenTuple, IsRepeatedTuple, Tail, Tuple, TupleKeyOf} from "./tuple";
import {AnyFunc, IfExact, IfNever, IsExact, IsExtends, IsWide} from "./types";

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
    T extends ArrayRO ? TupleKeyOf<T> | If<IsOpenTuple<T>, string> :
    {
        [P in keyof T]-?:
        P extends string ? P :
        P extends number ? KeyToString<P> :
        never;
    }[keyof T];

export type ObjValueOf<T> =
    T extends ArrayRO ? T[number] : T[keyof T];

export type ObjEntryOf<T> =
    T extends ArrayRO
    ? { [P in TupleKeyOf<T>]: [P, T[P]] }[TupleKeyOf<T>]
    : { [P in KeyOf<T>]: [KeyToString<P>, T[P]] }[KeyOf<T>];

export type Get<T, K extends AnyKey, TDefault = never> =
    K extends keyof T ? T[K] :
    T extends { [P in K]: infer V } ? V :
        // T extends { [P in K]?: infer V } ? V | undefined :
    TDefault;

export type Has<T, K extends AnyKey> =
    K extends keyof T ? true : IsExtends<T, Rec<K>>;

export type GetDeep<T, L extends AnyKey[]> =
    L extends [] ? T :
    T extends any ? GetDeep<Get<T, L[0]>, Tail<L>> :
    never;

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

export type Rewrite<T> = { [P in keyof T]: T[P] };
export type Overwrite<T, U> = MyOmit<T, keyof U> & U;
export type Replace<T, U> = MyPick<Overwrite<T, U>, keyof T>;

export type ExcludeWide<T> =
    T extends any ? If<IsWide<T>, never, T> : never;

// ? Omit<T, number>
//     & {[P in NumberToString<Extract<OptionalKeys<O>, number>>]?: Get<T, P>}
//     & {[P in NumberToString<Extract<RequiredKeys<O>, number>>]: Get<T, P>}
// & Partialize<{ [P in NumberToString<NumberKeyOf<T>>]: Get<Required<T>, P}, >
// & (number extends keyof T ? { [id: string]: GetIndexSignature<T> } : {});

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

export type Writable<T> = {
    -readonly [P in keyof T]: T[P];
};

export type ReadonlyKeys<T> = Exclude<KeyOf<T>, WritableKeys<T>>;
export type WritableKeys<T> = {
    [P in KeyOf<T>]-?: IfExact<Pick<Required<T>, P>, Writable<Pick<Required<T>, P>>, P>
}[KeyOf<T>];

export type Require<T, K extends AnyKey = keyof T> = Overwrite<T, Required<MyPick<T, K>>>;

export type Partialize<T, K extends AnyKey = keyof T> = Overwrite<T, Partial<MyPick<T, K>>>;

export type Ensure<T, K extends AnyKey> = {
    [P in K]-?: Get<T, K, unknown>
} & T;

export type Entry<K extends AnyKey | undefined = any, V = any> = [K, V];

export type Rec<K, V = any> =
    undefined extends K
    ? { [P in K & AnyKey]?: V }
    : { [P in K & AnyKey]: V };

export type FromEntry<E extends Partial<Entry>> =
    E extends [any?, any?]
    ? Rec<Head<E>, E[1]>
    : never;

export type FromEntries<L extends Entry[]> =
    L extends [] ? {} :
    L extends [MustBe<infer H, Entry>, ...infer R]
    ? R extends Entry[]
      ? FromEntry<H> & FromEntries<R>
      : never
    : FromEntry<L[number]>;

export type Exclusive<T, U> =
    (T | U) extends any
    ? (Without<T, U> & U) | (Without<U, T> & T)
    : T | U;

export type Without<T, U> = { [K in Exclude<keyof T, keyof U>]?: never };

export type ObjectZip<K extends ArrayRO, V extends ArrayRO> =
    K extends [] ? {} :
    IsRepeatedTuple<K> extends true ? Rec<K[number], V[number]> :
    Rec<Head<K>, Head<V>> & ObjectZip<Tail<K>, Tail<V>>;

export type Assign<T, S extends ArrayRO> =
    S extends [] ? T :
    S extends Tuple<infer H, infer R> ? Assign<Overwrite<T, H>, R> :
    Overwrite<T, S[number]>;
