import {Ctor, Func} from "./function";
import {ArrayRO} from "./tuple";
import {Primitive} from "./types";

export type MustBe<T extends U, U> = T;
export type MustBeAny<T extends any> = T;
export type MustBeObject<T extends object> = T;
export type MustBeFunc<T extends Func> = T;
export type MustBeCtor<T extends Ctor> = T;
export type MustBePrimitive<T extends Primitive> = T;
export type MustBeNumber<T extends number> = T;
export type MustBeString<T extends string> = T;
export type MustBeBoolean<T extends boolean> = T;
export type MustBeTrue<T extends true> = T;
export type MustBeFalse<T extends false> = T;
export type MustBeKey<T extends PropertyKey> = T;

export type MustBeArray<T extends ArrayRO> = T;
