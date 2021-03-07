import {assert, ensureMap, wrapDescriptor} from "@sirian/common";
import {Func} from "@sirian/ts-extra-types";
import {methodDecorator} from "./decorators";

export const bind = methodDecorator(() =>
    (target, key, desc) => {
        assert(!!desc, "[bind] requires descriptor", {target, key});

        const map = new WeakMap<object, WeakMap<Func, any>>();

        return wrapDescriptor(target, key, {
            get: (object, previous) => {
                const objMap = ensureMap(map, object, () => new WeakMap());

                const fn = previous();
                return ensureMap(objMap, fn, () => fn.bind(object));
            },
        });
    });
