import {Func0, Func1} from "@sirian/ts-extra-types";
import {_Function} from "./native";
import {Obj} from "./Obj";

const fnProto = _Function.prototype;
const fnToString = fnProto.toString;

export class Fn {
    public static stringify(fn: Function) {
        return fnToString.call(fn);
    }

    public static execute(code: string, args: Record<string, any> = {}) {
        const argNames = Obj.keys(args);
        const fn = new _Function(...argNames, code);
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

    public static compose<T, U, V>(f: (arg: T) => U, g: (arg: U) => V): (arg: T) => V {
        return (arg: T) => g(f(arg));
    }

    public static throw(error: any): never {
        throw error;
    }

    public static try<T, R>(fn: () => T): T | undefined;
    public static try<T, R>(fn: () => T, onError: (err: any) => R): T | R;
    public static try(fn: Func0, onError?: Func1) {
        try {
            return fn();
        } catch (error) {
            if (onError) {
                return onError(error);
            }
        }
    }
}
