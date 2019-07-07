import {Args, Drop, Func, Func0, Func1, Get} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";

const fnProto = Function.prototype;
const fnToString = fnProto.toString;

export const Fn = new class {
    public stringify(fn: Function) {
        return fnToString.call(fn);
    }

    public execute(code: string, args: Record<string, any> = {}) {
        const argNames = Obj.keys(args);
        const fn = new Function(...argNames, code);
        const argValues = argNames.map((name) => args[name]);
        return fn(...argValues);
    }

    public stripArgs(fn: Function, args: any[]) {
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

    public bindArgs<K extends number, F extends Func>(fn: F, bind: { [P in K]: Get<Args<F>, P> }) {
        return function(this: any, ...args: Drop<Args<F>, K>) {
            const mergedArgs: any[] = Obj.assign([], bind);

            for (let i = 0; args.length > 0; i++) {
                if (i in mergedArgs) {
                    continue;
                }

                mergedArgs[i] = args.shift();
            }

            return fn.apply(this, mergedArgs as Args<F>) as ReturnType<F>;
        };
    }

    public compose<T, U, V>(f: (arg: T) => U, g: (arg: U) => V): (arg: T) => V {
        return (arg: T) => g(f(arg));
    }

    public throw(error: any): never {
        throw error;
    }

    public try<T, R>(fn: () => T): T | undefined;
    public try<T, R>(fn: () => T, onError: (err: any) => R): T | R;
    public try(fn: Func0, onError?: Func1) {
        try {
            return fn();
        } catch (error) {
            if (onError) {
                return onError(error);
            }
        }
    }
};
