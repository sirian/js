import {Return, TupleToObject} from "@sirian/ts-extra-types";
import {isPrimitive} from "./Is";
import {ensureMap} from "./XUtils";

export const getCached = ensureMap.bind(null, new WeakMap()) as (<T>(key: object, fn: () => T) => T);

export const argsToken = <T extends any[]>(...tuple: T): TupleToObject<T> => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const createMaps = () => [new WeakMap<any, any>(), new Map<any, any>()] as const;
    const getMap = (m: Return<typeof createMaps>, value: any) => m[isPrimitive(value) ? 1 : 0];

    const cache = getCached(argsToken, createMaps);
    const res = tuple.reduce((prev: Return<typeof createMaps>, value: any) => ensureMap(getMap(prev, value), value, createMaps), cache);

    return ensureMap(getMap(cache, res), res, () => Object.freeze({...tuple}));
};
