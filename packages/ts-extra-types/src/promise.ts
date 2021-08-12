import {Func} from "./function";
import {ArrayRO} from "./tuple";

export type Awaited<T> =
    T extends void ? undefined :
    T extends PromiseLike<infer U> ? Awaited<U> :
    T;

export type AwaitedArray<T extends ArrayRO> = { [K in keyof T]: Awaited<T[K]> };

export type MaybePromise<T> = T | PromiseLike<T>;

export type MaybeAsync<F extends Func> = F extends Func<infer R, infer A, infer T> ? Func<MaybePromise<R>, A, T> : never;
