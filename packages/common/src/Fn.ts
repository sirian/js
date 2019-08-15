import {Args, Drop, Func, Func0, Func1, Get, Return} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Var} from "./Var";

export class Fn {
    public static stringify = Fn.withThis(Function.prototype.toString);

    public static withThis<R, A extends any[], T = any>(fn: (this: T, ...args: A) => R): (thisArg: T, ...args: A) => R {
        return (thisArg, ...args) => Ref.apply(fn, thisArg, args);
    }

    public static execute(code: string, args: Record<string, any> = {}) {
        const argNames = Obj.keys(args);
        const fn = new Function(...argNames, code);
        const argValues = argNames.map((name) => args[name]);
        return fn(...argValues);
    }

    public static stripArgs(fn: Function, args: any[]) {
        const required = fn.length;
        const len = args.length;

        let index = required - 1;
        for (let i = index; i < len; i++) {
            if (args[i] !== undefined) {
                index = i;
            }
        }

        return args.slice(0, index + 1);
    }

    public static bindArgs<K extends number, F extends Func>(fn: F, bind: { [P in K]: Get<Args<F>, P> }) {
        return function(this: any, ...args: Drop<Args<F>, K>) {
            const mergedArgs: any[] = Object.assign([], bind);

            for (let i = 0; args.length > 0; i++) {
                if (i in mergedArgs) {
                    continue;
                }

                mergedArgs[i] = args.shift();
            }

            return fn.apply(this, mergedArgs as Args<F>) as Return<F>;
        };
    }

    public static compose<T, U, V>(f: (arg: T) => U, g: (arg: U) => V): (arg: T) => V {
        return (arg: T) => g(f(arg));
    }

    public static throw(error: any): never {
        throw error;
    }

    public static async tryAsync<T>(fn: () => T): Promise<T | void>;
    public static async tryAsync<T, R>(fn: () => T, onError: R | ((err: any, ...args: any[]) => R)): Promise<T | R>;
    public static async tryAsync(fn: Func0, onError?: Func1) {
        try {
            return await fn();
        } catch (error) {
            return Var.isFunction(onError) ? await onError(error) : onError;
        }
    }

    public static try<T>(fn: () => T): T | undefined;
    public static try<T, R>(fn: () => T, onError: R | ((err: any, ...args: any[]) => R)): T | R;
    public static try(fn: Func0, onError?: Func1) {
        try {
            return fn();
        } catch (error) {
            return Var.isFunction(onError) ? onError(error) : onError;
        }
    }
}
