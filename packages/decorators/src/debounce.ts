import {Descriptor, Var} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {Debouncer, IDebouncerOptions} from "./Debouncer";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";

export const debounce = Decorator.forMethod(<A extends any[]>(options: number | Partial<IDebouncerOptions<A>> = {}) => {
    return (target, key, descriptor: TypedPropertyDescriptor<Func<void, A>>) => {
        if (!Descriptor.isDataDescriptor(descriptor) || !Var.isFunction(descriptor.value)) {
            throw new DecorateError("Only put a @debounce decorator on a method");
        }

        descriptor.value = Debouncer.debounce(descriptor.value, options);

        return descriptor;
    };
});
