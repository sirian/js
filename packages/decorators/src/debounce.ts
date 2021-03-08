import {assert, ensureMap, HybridMap, isFunction, isNumber, wrapDescriptor} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";

declare function setTimeout(handler: (...args: any[]) => void, timeout: number): any;

export interface IDebouncerOptions<A extends any[]> {
    ms?: number | Func<number, [any, A]>;
    hasher?: Func<any, A>;
}

export const createDebouncer = <A extends any[]>(fn: (...args: A) => any, options: number | IDebouncerOptions<A> = {}) => {
    const map = new HybridMap(() => new HybridMap<any, A>());

    if (isNumber(options)) {
        options = {ms: options};
    }

    const ms = options.ms ?? 300;
    const hasher = options.hasher;

    return new Proxy(fn, {
        apply: (target, thisArg, args: A) => {
            const m = map.ensure(thisArg);
            const hashKey = hasher?.(...args);

            if (!m.has(hashKey)) {
                const timeoutMs = isFunction(ms) ? ms(thisArg, args) : ms;
                setTimeout(() => fn.apply(thisArg, m.pick(hashKey, true)), timeoutMs);
            }

            m.set(hashKey, args);
        },
    });
};

export const debounce = <A extends any[]>(options: number | IDebouncerOptions<A> = {}) =>
    (proto: object, key: PropertyKey, desc: TypedPropertyDescriptor<(...args: A) => void>) => {
        assert(!!desc, "[debounce] requires descriptor", {proto, key});

        const map = new Map();

        return wrapDescriptor(proto, key, {
            get: (object, parent) => {
                const fn = parent();

                assert(isFunction(fn), "[debounce] requires function", {proto, key});

                return ensureMap(map, fn, () => createDebouncer(fn, options));
            },
        }) as any;
    };
