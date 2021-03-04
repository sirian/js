import {assert, HybridMap, isFunction, isNumber, wrapDescriptor} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {methodDecorator} from "./decorators";

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

export const debounce = methodDecorator(<A extends any[]>(options: number | IDebouncerOptions<A> = {}) =>
    (target, key, desc: TypedPropertyDescriptor<(...args: A) => void>) => {
        assert(!!desc, "@debounce requires descriptor");

        const map = new Map();

        return wrapDescriptor(target, key, {
            get: (object, parent) => {
                const fn = parent();

                assert(isFunction(fn));

                if (!map.has(fn)) {
                    map.set(fn, createDebouncer(fn, options));
                }

                return map.get(fn);
            },
        }) as any;
    });
