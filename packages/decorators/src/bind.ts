import {assert, ensureMap, wrapDescriptor} from "@sirian/common";

export const bind = () =>
    <F extends Function>(target: object, key: PropertyKey, desc: TypedPropertyDescriptor<F>) => {
        assert(!!desc, "[bind] requires descriptor", {target, key});

        const map = new WeakMap<object, WeakMap<F, any>>();

        return wrapDescriptor(target, key, {
            get: (object, previous) => {
                const objMap = ensureMap(map, object, () => new WeakMap());

                const fn = previous() as F;

                return ensureMap(objMap, fn, () => fn.bind(object));
            },
        }) as TypedPropertyDescriptor<F>;
    };
