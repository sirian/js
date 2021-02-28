import {assert, Descriptor, isFunction} from "@sirian/common";
import {Debouncer, IDebouncerOptions} from "./Debouncer";
import {methodDecorator} from "./decorator";

export const debounce = methodDecorator(<A extends any[]>(options: number | IDebouncerOptions<A> = {}) =>
    (target, key, desc: TypedPropertyDescriptor<(...args: A) => void>) => {
        assert(!!desc, "@debounce requires descriptor");

        const map = new Map();

        return Descriptor.wrap(target, key, {
            get: (object, parent) => {
                const fn = parent();

                assert(isFunction(fn));

                if (!map.has(fn)) {
                    map.set(fn, Debouncer.debounce(fn, options));
                }

                return map.get(fn);
            },
        }) as any;
    });
