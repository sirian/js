import {assert, ensureMap, wrapDescriptor} from "@sirian/common";
import {methodDecorator} from "./decorators";

export const bind = methodDecorator(() =>
    (target, key, desc) => {
        assert(!!desc, "[bind] requires descriptor", {target, key});

        const map = new WeakMap();

        return wrapDescriptor(target, key, {
            get: (object, previous) => {
                const objMap = ensureMap(map, object, () => new WeakMap());

                const fn = previous();
                return ensureMap(objMap, fn, () => fn.bind(object));
            },
        });
    });
