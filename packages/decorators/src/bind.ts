import {Descriptor, XWeakMap} from "@sirian/common";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";

export const bind = Decorator.forMethod(() => {
    return (proto: object, key: PropertyKey, desc: PropertyDescriptor) => {
        if (!desc) {
            throw new DecorateError("@bind requires descriptor");
        }

        const bound = new XWeakMap();

        return Descriptor.wrap<any, any>(proto, key, {
            get: (object, parent) => {
                if (!bound.has(object)) {
                    const fn = parent();
                    bound.set(object, fn.bind(object));
                }
                return bound.get(object)!;
            },
        });
    };
});
