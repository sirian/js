import {Head, IsOpenTuple, Length, Tail} from "./tuple";

export type StrToArray<T extends string> =
    T extends "" ? [] :
    T extends `${infer A}${infer B}` ? [A, ...StrToArray<B>] :
    string[];

export type StrJoin<T extends string[], S extends string = ""> =
    T extends [] ? "" :
    T extends [infer H] ? H :
    IsOpenTuple<T> extends true ? string :
    `${Head<T>}${S}${StrJoin<Tail<T>>}`;

export type StrLength<T extends string> = Length<StrToArray<T>>;

export type StrReverse<T extends string> = T extends `${infer A}${infer B}` ? `${StrReverse<B>}${A}` : T;

export interface TemplateStringsLike {
    readonly [n: number]: string;

    readonly length: number;
    raw?: readonly string[];
}
