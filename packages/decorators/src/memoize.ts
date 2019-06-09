import {Descriptor, DescriptorType} from "@sirian/common";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";
import {IMemoizerOptions, Memoizer} from "./Memoizer";

export const memoize = Decorator.forMethod((options?: IMemoizerOptions<any>) => {
    return (targets, key, descriptor) => {
        const type = Descriptor.getDescriptorType(descriptor);

        switch (type) {
            case DescriptorType.ACCESSOR:
                const getter = descriptor.get;
                if (getter) {
                    descriptor.get = Memoizer.memoize(getter, options);
                    return descriptor;
                }
                break;

            case DescriptorType.DATA:
                descriptor.value = Memoizer.memoize(descriptor.value, options);
                return descriptor;
        }

        throw new DecorateError("Only put a @memoize decorator on a method or get accessor.");
    };
});
