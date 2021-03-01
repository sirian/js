import {assert, wrapDescriptor} from "@sirian/common";
import {methodDecorator} from "./decorator";

export const bind = methodDecorator(() =>
    (proto, key, desc) => {
        assert(!!desc, "@bind requires descriptor");

        const map = new WeakMap();

        return wrapDescriptor(proto, key, {
            get: (object, previous) => {
                if (!map.has(object)) {
                    map.set(object, new WeakMap());
                }
                const objMap = map.get(object);

                const fn = previous();
                if (!objMap.has(fn)) {
                    objMap.set(fn, fn.bind(object));
                }

                return objMap.get(fn);
            },
        });
    });
