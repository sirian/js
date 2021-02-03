import {ArrayRO} from "./tuple";

export type Awaited<T> =
    T extends void ? undefined :
    T extends PromiseLike<infer U> ? Awaited<U> :
    T;

export type AwaitedArray<T extends ArrayRO> =
    T extends [] ? [] :
    T extends [infer H, ...infer R] ? [Awaited<H>, ...AwaitedArray<R>] :
    Array<Awaited<T[number]>>;
