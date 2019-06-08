import { Lengthwise } from "./interfaces";
import { Numbers } from "./number";
import { OmitIndexSignature, ToStringRecord, TypedKeyOf, ValueOf } from "./object";
import { Length, Repeat } from "./tuple";
import { AnyFunc } from "./types";
export declare type Cast<T, P, D extends P = P> = T extends P ? T : D;
export declare type CastFunc<T> = T extends AnyFunc ? T : never;
export declare type ArraySymbols = {
    [Symbol.iterator]: any;
    [Symbol.unscopables]: any;
};
export declare type ObjectToArray<T extends Lengthwise> = ToStringRecord<T> extends infer O ? Repeat<Length<T>, ValueOf<O>> & OmitIndexSignature<O> : never;
export declare type ToNumber<T extends boolean | null | undefined | string | number> = T extends number ? T : T extends true ? 1 : T extends false | null | undefined | "" ? 0 : T extends string ? StringToNumber<T> : never;
export declare type ToString<T extends boolean | null | undefined | string | number> = T extends string ? T : T extends true ? "true" : T extends false ? "false" : T extends null ? "null" : T extends undefined ? "undefined" : T extends number ? NumberToString<T> : never;
export declare type StringToNumber<S extends string | number> = S extends number ? S : S extends keyof Numbers ? Numbers[S] : S extends string ? number : never;
export declare type NumberToString<N extends number | string> = N extends string ? N : N extends Numbers[keyof Numbers] ? TypedKeyOf<Numbers, N> : string;
//# sourceMappingURL=cast.d.ts.map