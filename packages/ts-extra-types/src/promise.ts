import {ArrayRO} from "./tuple";

export type Awaited<T> =
    T extends void ? undefined :
    T extends PromiseLike<infer U> ? Awaited<U> :
    T;

export type AwaitedArray<T extends ArrayRO> = { [K in keyof T]: Awaited<T[K]> };
