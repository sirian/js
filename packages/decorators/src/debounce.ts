import {Descriptor, XMap} from "@sirian/common";
import {Debouncer, IDebouncerOptions} from "./Debouncer";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";

export const debounce = Decorator.forMethod(<A extends any[]>(options: number | IDebouncerOptions<A> = {}) => {
    return (target, key, desc: TypedPropertyDescriptor<(...args: A) => void>) => {
        if (!desc) {
            throw new DecorateError("@debounce requires descriptor");
        }
        const map = new XMap((obj) => {
            const fn = Descriptor.read(desc, obj);
            return Debouncer.debounce(fn.bind(obj), options);
        });

        return Descriptor.extend(desc, {
            get() {
                return map.ensure(this);
            },
        });
    };
});
