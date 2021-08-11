import {Func, Func0} from "@sirian/ts-extra-types";
import {applyIfFunction} from "./ref";

declare function setTimeout(fn: Func, ms: number): void;

export async function tryAsync<T>(fn: () => T | PromiseLike<T>): Promise<T | undefined>;
export async function tryAsync<T, R>(fn: () => T | PromiseLike<T>, onError: R | PromiseLike<R> | ((err: any) => R | PromiseLike<R>)): Promise<T | R>;
export async function tryAsync(fn: Func0, onError?: any) {
    try {
        return await fn();
    } catch (error) {
        return applyIfFunction(onError, error);
    }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
