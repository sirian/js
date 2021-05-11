import {CastBool} from "./cast";
import {AsyncFunc, Ctor, Func} from "./function";
import {And, If, Not} from "./logic";
import {AnyKey} from "./object";
import {ArrayRO} from "./tuple";

export type Primitive = boolean | bigint | number | string | symbol | null | undefined | void;
export type Nullish = void | null | undefined;
export type Falsy = 0 | 0n | null | undefined | false | "";

export type Widen<T> =
    T extends null ? T :
    T extends boolean ? boolean :
    T extends number ? number :
    T extends bigint ? bigint :
    T extends symbol ? symbol :
    T extends string ? string :
    T;

export type Wrap<T> =
    T extends null | undefined ? Record<any, any> :
    T extends number ? Number :
    T extends string ? String :
    T extends symbol ? Symbol :
    T extends boolean ? Boolean :
    T extends bigint ? BigInt :
    T extends object ? T :
    T;

export type AnyFunc = Func | Ctor | CallableFunction | NewableFunction;
export type AnyType = Primitive | AnyFunc | ObjectOnly;

export type NotFunc = Primitive | ObjectOnly;
export type ObjectOnly = any[] | object & { caller?: never };

export type TypeName = TypeNameOf<any>;
export type XTypeName = XTypeNameOf<any>;

export type TypeNameOf<T> =
    T extends null ? "object" :
    T extends AnyFunc ? "function" :
    T extends object ? "object" :
    T extends string ? "string" :
    T extends number ? "number" :
    T extends bigint ? "bigint" :
    T extends void | undefined ? "undefined" :
    T extends symbol ? "symbol" :
    T extends boolean ? "boolean" :
    never;

export type XTypeNameOf<T> =
    T extends null ? "null" :
    T extends ArrayRO ? "array" :
    TypeNameOf<T>;

export type ExtractByXTypeName<T, Type extends XTypeName> =
    T extends any
    ? XTypeNameOf<T> extends Type ? T : never
    : never;

export type ExtractByTypeName<T, Type extends TypeName> =
    T extends any
    ? TypeNameOf<T> extends Type ? T : never
    : never;

export type ExtractFunction<T> = Extract<T, AnyFunc>;
export type ExtractArray<T> = Extract<T, any[]>;
export type ExtractObject<T> = Exclude<Extract<T, object>, AnyFunc>;
export type ExtractSyncFunc<T> = Exclude<ExtractFunction<T>, AsyncFunc>;

export type Predicate<T = any> = (value: T) => boolean;

export type TypeGuard<U extends V = any, V = any, R extends ArrayRO = any[]> = (arg: V, ...rest: R) => arg is U;

export type Negate<F extends Func> =
    F extends TypeGuard<infer U, infer V, infer Rest> ? TypeGuard<Exclude<V, U>, V, Rest> :
    F extends Func<infer R, infer A, infer This> ? Func<Not<CastBool<R>>, A, This> :
    never;

export type GuardedType<T extends Func> = T extends TypeGuard<infer R> ? R : never;

export type IsTrue<X> = IsExact<X, true>;

export type IsExact<X, Y> =
    [X, Y] extends [Y, X]
    ? (<T>() => T extends [X, keyof X, Y, keyof Y] ? 1 : 0) extends (<T>() => T extends [Y, keyof Y, X, keyof X] ? 1 : 0)
      ? true
      : false
    : false;

export type IfExact<X, Y, T = X, F = never> = If<IsExact<X, Y>, T, F>;
export type IfNever<X, T, F = X> = IfExact<X, never, T, F>;

export type IsExtends<X, Y> = [X] extends [Y] ? true : false;
export type IfExtends<X, Y, T = X, F = never> = If<IsExtends<X, Y>, T, F>;
export type IfNotExtends<X, Y, T = X, F = never> = IfExtends<X, Y, F, T>;
export type HasKey<T, K extends AnyKey> = K extends keyof T ? true : false;
export type HasExactKey<T, K extends AnyKey> = { [P in keyof T]-?: IfExact<P, K, true, never> }[keyof T];

export type IsSubType<V, T> = And<IsExtends<V, T>, Not<IsExtends<T, V>>>;
export type IsFiniteNumber<V> = IsSubType<V, number>;
export type IsWide<T> = Widen<T> extends T ? true : false;

export type ToPrimitive<T> =
    T extends Primitive ? T :
    T extends { [Symbol.toPrimitive](hint?: string): infer R1 } ? Extract<R1, Primitive> :
    T extends { valueOf(): infer R2 } ? Extract<R2, Primitive> :
    never;

export type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type DeepRequire<T> = {
    [P in keyof T]-?: DeepRequire<T[P]>;
};
