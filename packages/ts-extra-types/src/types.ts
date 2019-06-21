import {AsyncFunc, Ctor, Func} from "./function";
import {And, If, Not} from "./logic";

export type NonNull = object | boolean | bigint | number | string | symbol;
export type Primitive = boolean | bigint | null | number | string | symbol | undefined | void;

export type AnyFunc = Func | Function | Ctor;
export type AnyType = Primitive | AnyFunc | NotFunc;

export type NotFunc = Primitive | any[] | {
    [id: string]: unknown;
    caller?: never,
};

export type TypeName = "function" | "object" | "string" | "number" | "boolean" | "symbol" | "bigint" | "undefined";
export type XTypeName = TypeName | "null" | "array";

export type TypeNameOf<T> =
    T extends null | any[] ? "object" : XTypeNameOf<T>;

export type XTypeNameOf<T> =
    T extends null ? "null" :
    T extends any[] ? "array" :
    T extends AnyFunc ? "function" :
    T extends object ? "object" :
    T extends string ? "string" :
    T extends number ? "number" :
    T extends bigint ? "bigint" :
    T extends void | undefined ? "undefined" :
    T extends symbol ? "symbol" :
    T extends boolean ? "boolean" :
    never;

export type ExtractByXTypeName<T, Type extends XTypeName> =
    T extends any
    ? XTypeNameOf<T> extends Type ? T : never
    : never;

export type ExtractByTypeName<T, Type extends TypeName> =
    T extends any
    ? TypeNameOf<T> extends Type ? T : never
    : never;

export type ExtractFunction<T> = Extract<T, AnyFunc>;
export type ExtractObject<T> = Exclude<Extract<T, object>, AnyFunc>;
export type ExtractSyncFunc<T> = Exclude<ExtractFunction<T>, AsyncFunc>;

export type Predicate<T = any> = (value: T) => boolean;

export type TypeGuard<U extends V = any, V = any, R extends any[] = any[]> = (arg: V, ...rest: R) => arg is U;

export type GuardedType<T extends Func> = T extends TypeGuard<infer R> ? R : never;

export type IsExact<X, Y> = And<IsExtendsStrict<X, Y>, IsExtendsStrict<Y, X>>;

export type IsExtendsStrict<X, Y> =
    (<T>() => T extends X ? 1 : 0) extends (<T>() => T extends Y ? 1 : 0)
    ? IsExtends<X, Y>
    : false;

export type IfExact<X, Y, T = X, F = never> = If<IsExact<X, Y>, T, F>;
export type IfNever<X, T, F = X> = IfExact<X, never, T, F>;

export type IsExtends<X, Y> = [X] extends [Y] ? true : false;
export type IfExtends<X, Y, T = X, F = never> = If<IsExtends<X, Y>, T, F>;
export type IfNotExtends<X, Y, T = X, F = never> = X extends Y ? F : T;

export type IsSubType<V, T> = And<IsExtends<V, T>, Not<IsExtends<T, V>>>;
export type IsFiniteNumber<V> = IsSubType<V, number>;
export type IsWide<T> = IsExact<Widen<T>, T>;

export type Widen<T> =
    T extends boolean ? boolean :
    T extends number ? number :
    T extends bigint ? bigint :
    T extends symbol ? symbol :
    T extends string ? string :
    T;

export type ToObject<T> =
    T extends boolean ? Boolean :
    T extends number ? Number :
    T extends bigint ? BigInt :
    T extends symbol ? Symbol :
    T extends string ? String :
    T extends null | undefined | void ? Object :
    T extends object ? T :
    unknown;

export type ExtractPrimitive<T> = Extract<T, Primitive>;

export type ToPrimitive<T> = ExtractPrimitive<(
    T extends Primitive ? T :
    T extends { [Symbol.toPrimitive](hint?: string): infer R1 } ? R1 :
    T extends { valueOf(): infer R2 } ? R2 :
    never
    )>;

export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepRequire<T> = {
    [P in keyof T]-?: DeepRequire<T[P]>;
};

export type Thenable = { then: AnyFunc };
