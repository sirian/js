import { Ctor, Func } from "./function";
import { Primitive } from "./types";
export declare type MustBe<T extends U, U> = T;
export declare type MustBeAny<T extends any> = T;
export declare type MustBeObject<T extends object> = T;
export declare type MustBeFunc<T extends Func> = T;
export declare type MustBeCtor<T extends Ctor> = T;
export declare type MustBePrimitive<T extends Primitive> = T;
export declare type MustBeNumber<T extends number> = T;
export declare type MustBeString<T extends string> = T;
export declare type MustBeBoolean<T extends boolean> = T;
export declare type MustBeTrue<T extends true> = T;
export declare type MustBeFalse<T extends false> = T;
export declare type MustBeKey<T extends PropertyKey> = T;
export declare type MustBeRecord<T extends Record<any, any>> = T;
export declare type MustBeArray<T extends any[]> = T;
//# sourceMappingURL=mustbe.d.ts.map