import { AsyncFunc, Ctor, Func } from "./function";
import { And, If, Not } from "./logic";
export declare type NonNull = object | boolean | bigint | number | string | symbol;
export declare type Primitive = boolean | bigint | null | number | string | symbol | undefined | void;
export declare type AnyFunc = Func | Function | Ctor;
export declare type AnyType = Primitive | AnyFunc | NotFunc;
export declare type NotFunc = Primitive | any[] | {
    [id: string]: unknown;
    caller?: never;
};
export declare type TypeName = "function" | "object" | "string" | "number" | "boolean" | "symbol" | "bigint" | "undefined";
export declare type XTypeName = TypeName | "null" | "array";
export declare type TypeNameOf<T> = T extends null | any[] ? "object" : XTypeNameOf<T>;
export declare type XTypeNameOf<T> = T extends null ? "null" : T extends any[] ? "array" : T extends AnyFunc ? "function" : T extends object ? "object" : T extends string ? "string" : T extends number ? "number" : T extends bigint ? "bigint" : T extends void | undefined ? "undefined" : T extends symbol ? "symbol" : T extends boolean ? "boolean" : never;
export declare type ExtractByXTypeName<T, Type extends XTypeName> = T extends any ? XTypeNameOf<T> extends Type ? T : never : never;
export declare type ExtractByTypeName<T, Type extends TypeName> = T extends any ? TypeNameOf<T> extends Type ? T : never : never;
export declare type ExtractFunction<T> = Extract<T, AnyFunc>;
export declare type ExtractObject<T> = Exclude<Extract<T, object>, AnyFunc>;
export declare type ExtractSyncFunc<T> = Exclude<ExtractFunction<T>, AsyncFunc>;
export declare type Predicate<T = any> = (value: T) => boolean;
export declare type TypeGuard<U extends V = any, V = any, R extends any[] = any[]> = (arg: V, ...rest: R) => arg is U;
export declare type GuardedType<T extends Func> = T extends TypeGuard<infer R> ? R : never;
export declare type IsExact<X, Y> = And<IsExtendsStrict<X, Y>, IsExtendsStrict<Y, X>>;
export declare type IsExtendsStrict<X, Y> = And<IsExtends<X, Y>, IsExtends<(<T>() => T extends X ? 1 : 0), (<T>() => T extends Y ? 1 : 0)>>;
export declare type IfExact<X, Y, T = X, F = never> = If<IsExact<X, Y>, T, F>;
export declare type IfNever<X, T, F = X> = IfExact<X, never, T, F>;
export declare type IsExtends<X, Y> = [X] extends [Y] ? true : false;
export declare type IfExtends<X, Y, T = X, F = never> = If<IsExtends<X, Y>, T, F>;
export declare type IfNotExtends<X, Y, T = X, F = never> = X extends Y ? F : T;
export declare type IsSubType<V, T> = And<IsExtends<V, T>, Not<IsExtends<T, V>>>;
export declare type IsFiniteNumber<V> = IsSubType<V, number>;
export declare type IsWide<T> = IsExact<Widen<T>, T>;
export declare type Widen<T> = T extends boolean ? boolean : T extends number ? number : T extends bigint ? bigint : T extends symbol ? symbol : T extends string ? string : T;
export declare type ToObject<T> = T extends boolean ? Boolean : T extends number ? Number : T extends bigint ? BigInt : T extends symbol ? Symbol : T extends string ? String : T extends null | undefined | void ? Object : T extends object ? T : unknown;
export declare type ExtractPrimitive<T> = Extract<T, Primitive>;
export declare type ToPrimitive<T> = ExtractPrimitive<(T extends Primitive ? T : T extends {
    [Symbol.toPrimitive](hint?: string): infer R1;
} ? R1 : T extends {
    valueOf(): infer R2;
} ? R2 : never)>;
export declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
export declare type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export declare type Thenable = {
    then: AnyFunc;
};
//# sourceMappingURL=types.d.ts.map