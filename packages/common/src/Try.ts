import {Func0, Func1} from "@sirian/ts-extra-types";
import {isFunction} from "./Is";
import {isPromiseLike} from "./Var";

export function tryCatch<T>(fn: () => T): T | undefined;
export function tryCatch<T, R>(fn: () => T, onError: R | ((err: any, ...args: any[]) => R)): T | R;
export function tryCatch(fn: Func0, onError?: Func1) {
    try {
        return fn();
    } catch (error) {
        return isFunction(onError) ? onError(error) : onError;
    }
}

export async function tryAsync<T>(fn: () => T): Promise<T | void>;
export async function tryAsync<T, R>(fn: () => T, onError: R | ((err: any, ...args: any[]) => R)): Promise<T | R>;
export async function tryAsync(fn: Func0, onError?: any) {
    const fallback = (error: any) => isFunction(onError) ? onError(error) : onError;
    try {
        const result = fn();
        return isPromiseLike(result) ? result.then(null, fallback) : result;
    } catch (error) {
        return fallback(error);
    }
}

export function throwError(err: any): never {
    throw err;
}
