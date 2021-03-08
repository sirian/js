import {argsToken, assert, isFunction} from "@sirian/common";
import {Args, Func, Return} from "@sirian/ts-extra-types";

export type Hasher<F extends Func> = (this: any, thisArg: any, ...args: Args<F>) => any;

export interface IMemoizerOptions<F extends Func> {
    hasher?: Hasher<F>;
}

export const memoized = <F extends Func>(fn: F, options?: IMemoizerOptions<F>) => {
    const tmp: unique symbol = Symbol();
    const map = new WeakMap<any, Return<F> | typeof tmp>();
    const hasher = options?.hasher;

    return new Proxy<F>(fn, {
        apply: (target, thisArg, args: Args<F>) => {
            const hashKey = hasher?.call(thisArg, thisArg, ...args);
            const token = argsToken(...[thisArg].concat(hashKey));

            if (!map.has(token)) {
                map.set(token, tmp);
                map.set(token, fn.apply(thisArg, args));
            }

            const value = map.get(token);

            assert(tmp !== value, "[memoize] circular call", {fn: fn.name});

            return value as Return<F>;
        },
    });
};

export const memoize = <F extends Func>(options?: IMemoizerOptions<F>) =>
    (proto: object, key: PropertyKey, descriptor: PropertyDescriptor) => {
        const descKey = descriptor?.get ? "get" : "value";
        const fn = descriptor[descKey];

        assert(isFunction(fn), "[memoize] requires method or getter", {proto, key});

        return {
            ...descriptor,
            [descKey]: memoized(fn, options),
        };
    };
