import {Args, Func, Func0, Func1, Get, Negate, Return, Splice} from "@sirian/ts-extra-types";
import {apply} from "./Ref";
import {isFunction, isPromiseLike} from "./Var";

export const noop = (() => {}) as Func;

export const not = <F extends Func>(fn: F) => function(this: any, ...args) {
    return !apply(fn, this, args);
} as Negate<F>;

// export const firstArg = <T extends any[]>(...args: T) => args[0] as Head<T>;

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
        return isPromiseLike(result) ? result.then((v) => v, fallback) : result;
    } catch (error) {
        return fallback(error);
    }
}

export const throwError = (err: any) => { throw err; };

export const callableClass = <T extends object, K extends keyof T>(method: K, ctor: T): T & T[K] => new Proxy(ctor, {
    apply: (target: any, thisArg, args) => target[method](...args),
}) as T & T[K];

export function createFn<T extends Record<string, any>>(code: string, args: T) {
    const argNames = Object.keys(args);
    const fn = new Function(...argNames, code);
    return function(newArgs: Partial<T> = {}) {
        const a = {...args, newArgs};
        const argValues = argNames.map((name) => a[name]);
        return fn(...argValues);
    };
}

export class Fn {
    public static execute(code: string, args: Record<string, any> = {}) {
        return createFn(code, args)();
    }

    public static stripArgs<A extends any[]>(fn: (...args: A) => any, args: A) {
        const required = fn.length;
        let length = args.length;

        while (length > required && args[length - 1] === undefined) {
            length--;
        }

        return args.slice(0, length);
    }

    public static bindArgs<K extends number, F extends Func>(fn: F, bind: { [P in K]: Get<Args<F>, P> }) {
        return function(this: any, ...args: Splice<Args<F>, K>) {
            const mergedArgs: any[] = Object.assign([], bind);

            for (let i = 0; args.length > 0; i++) {
                if (i in mergedArgs) {
                    continue;
                }

                mergedArgs[i] = args.shift();
            }

            return apply(fn, this, mergedArgs as Args<F>) as Return<F>;
        };
    }

    public static compose<T, U, V>(f: (arg: T) => U, g: (arg: U) => V): (arg: T) => V {
        return (arg: T) => g(f(arg));
    }
}
