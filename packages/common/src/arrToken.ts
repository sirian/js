import {Primitive} from "@sirian/ts-extra-types";
import {isPrimitive} from "./Is";
import {ensureMap, IMapMini} from "./utils";

export type ArrayToken<T extends unknown[]> = Readonly<T>

interface ArrayTokenCache {
    0?: Map<Primitive, ArrayTokenCache>,
    1?: WeakMap<object, ArrayTokenCache>,
}

export const arrToken = <T extends unknown[]>(...tuple: T): ArrayToken<T> => {
    let cache = arrToken as ArrayTokenCache;

    tuple.forEach((key) => {
        const map: IMapMini<unknown, ArrayTokenCache> =
            isPrimitive(key)
            ? cache[0] ??= new Map()
            : cache[1] ??= new WeakMap();

        cache = ensureMap(map, key, () => ([] as ArrayTokenCache));
    });

    const tokens = (arrToken as { tokens?: WeakMap<ArrayTokenCache, ArrayToken<T>> }).tokens ??= new WeakMap();

    return ensureMap(tokens, cache, () => Object.freeze(tuple) as ArrayToken<T>);
};

