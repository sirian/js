import {Return, TupleToObject} from "@sirian/ts-extra-types";
import {isPrimitive} from "./Is";
import {ensureMap} from "./XUtils";

export const getCached = <T>(key: object, fn: () => T): T =>
    ensureMap((getCached as any).cache ??= new WeakMap(), key, fn);

export const argsToken = <T extends any[]>(...tuple: T): TupleToObject<T> => {
    const createMaps = () => [new WeakMap(), new Map()] as [WeakMap<any, any>, Map<any, any>];
    const getMap = (m: Return<typeof createMaps>, value: any) => m[isPrimitive(value) ? 1 : 0];

    const cache = getCached(argsToken, createMaps);
    const res = tuple.reduce((prev: Return<typeof createMaps>, value: any) => ensureMap(getMap(prev, value), value, createMaps), cache);

    return ensureMap(getMap(cache, res), res, () => Object.freeze({...tuple}));
};
