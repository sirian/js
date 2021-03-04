import {assert, HybridMap, isFunction} from "@sirian/common";
import {Args, Func, Return} from "@sirian/ts-extra-types";
import {methodDecorator} from "./";

export interface IMemoizerOptions<A extends any[]> {
    hasher?: Func<any, A>;
}

export const createMemoizer = <F extends Func>(fn: F, options?: IMemoizerOptions<Args<F>>) => {
    const tmp: unique symbol = Symbol();
    const map = new HybridMap(() => new HybridMap<any, Return<F> | typeof tmp>());
    const hasher = options?.hasher;

    return new Proxy(fn, {
        apply: (target, thisArg, args: Args<F>) => {
            const m = map.ensure(thisArg);

            const hashKey = hasher?.(...args);

            if (!m.has(hashKey)) {
                m.set(hashKey, tmp);
                m.set(hashKey, fn.apply(thisArg, args));
            }

            const value = m.get(hashKey);

            assert(tmp !== value, `Circular @memoize call detected at ` + fn.name);

            return value as Return<F>;
        },
    });
};

export const memoize = methodDecorator((options?: IMemoizerOptions<any>) =>
    (target, key, descriptor) => {
        const descKey = descriptor?.get ? "get" : "value";
        const fn = descriptor[descKey];

        assert(isFunction(fn));

        return {
            ...descriptor,
            [descKey]: createMemoizer(fn, options),
        };
    });
