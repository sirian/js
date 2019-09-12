import {Descriptor, XWeakMap} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {DecorateError} from "./DecorateError";
import {Decorator} from "./Decorator";

export const bind = Decorator.forMethod(() => {
    return (proto, key, desc) => {
        if (!desc) {
            throw new DecorateError("@bind requires descriptor");
        }

        const map = new XWeakMap((obj) => new XWeakMap((fn: Func) => fn.bind(obj)));

        return Descriptor.wrap(proto, key, {
            get: (object, previous: () => any) => map.ensure(object).ensure(previous()) as PropertyDescriptor,
        });
    };
});
