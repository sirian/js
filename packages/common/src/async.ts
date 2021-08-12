import {Func, Func0, MaybePromise} from "@sirian/ts-extra-types";
import {applyIfFunction} from "./ref";

declare function setTimeout(fn: Func, ms: number): void;

export async function tryAsync<T>(fn: () => MaybePromise<T>): Promise<T | undefined>;
export async function tryAsync<T, R>(fn: () => MaybePromise<T>, onError: MaybePromise<R> | ((err: any) => MaybePromise<R>)): Promise<T | R>;
export async function tryAsync(fn: Func0, onError?: any) {
    try {
        return await fn();
    } catch (error) {
        return applyIfFunction(onError, error);
    }
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
