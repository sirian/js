import {Descriptor, XMap} from "@sirian/common";
import {Debouncer, IDebouncerOptions} from "./Debouncer";
import {DecorateError} from "./DecorateError";
import {methodDecorator} from "./Decorator";

export const debounce = methodDecorator(<A extends any[]>(options: number | IDebouncerOptions<A> = {}) =>
    (target, key, desc: TypedPropertyDescriptor<(...args: A) => void>) => {
        if (!desc) {
            throw new DecorateError("@debounce requires descriptor");
        }

        const map = new XMap((fn) => Debouncer.debounce(fn, options));

        return Descriptor.wrap(target, key, {
            get: (object, parent) => map.ensure(parent()),
        }) as any;
    });
