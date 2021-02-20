import {Func0} from "@sirian/ts-extra-types";
import {isFunction} from "./Is";
import {hasMethod} from "./Ref";

export const isPromiseLike = (value: any): value is PromiseLike<any> => hasMethod(value, "then");

export async function tryAsync<T>(fn: () => T | PromiseLike<T>): Promise<T | undefined>;
export async function tryAsync<T, R>(fn: () => T | PromiseLike<T>, onError: R | PromiseLike<R> | ((err: any) => R | PromiseLike<R>)): Promise<T | R>;
export async function tryAsync(fn: Func0, onError?: any) {
    const fallback = (error: any) => isFunction(onError) ? onError(error) : onError;
    try {
        const result = fn();
        return isPromiseLike(result) ? result.then(null, fallback) : result;
    } catch (error) {
        return fallback(error);
    }
}
