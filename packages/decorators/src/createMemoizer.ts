import {assert, HybridMap} from "@sirian/common";
import {Args, Func, Return} from "@sirian/ts-extra-types";

export interface IMemoizerOptions<A extends any[]> {
    hasher?: Func<any, A>;
}

export const createMemoizer = <F extends Func>(fn: F, options?: IMemoizerOptions<Args<F>>) => {
    const map = new HybridMap<any, HybridMap<any, Return<F> | symbol>>();
    const resolving = new Set();
    const hasher = options?.hasher;

    return new Proxy(fn, {
        apply: (target, thisArg, args: Args<F>) => {
            const m = map.ensure(thisArg, () => new HybridMap());

            const hashKey = hasher?.(...args);

            if (!m.has(hashKey)) {
                assert(!resolving.has(hashKey), `Circular @memoize call detected at ${fn.name}`);
                resolving.add(hashKey);
                m.set(hashKey, fn.apply(thisArg, args));
                resolving.delete(hashKey);
            }
            return m.get(hashKey)!;
        },
    });
};
