import {ArrayRO, Nullish} from "@sirian/ts-extra-types";
import {sort, sortBy} from "./arr";
import {assert} from "./Error";
import {isFunction} from "./Is";
import {XMap} from "./XMap";
import {XWeakMap} from "./XWeakMap";

export type HybridMapStore<K, V> = K extends object ? XWeakMap<K, V> : XMap<K, V>;
export type XMapInitializer<K = any, V = any> = (key: K) => V;
export type XMapSource<K = any, V = any> =
    | Nullish
    | Iterable<readonly [K, V]>
    | ArrayLike<readonly [K, V]>
    | Record<Extract<K, PropertyKey>, V>;

export interface IMapMini<K, V> {
    delete(key: K): boolean;

    get(key: K): V | undefined;

    has(key: K): boolean;

    set(key: K, value: V): this;
}

export interface ISetMini<T> {
    delete(value: T): boolean;

    has(value: T): boolean;

    add(value: T): this;
}

export const setMapEntries = <K, V>(map: Map<K, V>, entries: ArrayRO<readonly [K, V]>) => {
    map.clear();
    entries.forEach(([k, v]) => map.set(k, v));
    return map;
};

export const sortMap = <K, V>(map: Map<K, V>, compareFn: (a: [K, V], b: [K, V]) => number) =>
    setMapEntries(map, sort([...map.entries()], compareFn));

export const sortMapBy = <K, V>(map: Map<K, V>, fn: (k: K, v: V) => unknown) =>
    setMapEntries(map, sortBy([...map.entries()], ([k, v]) => fn(k, v)));

export const pickMap: {
    <K, V>(map: IMapMini<K, V>, key: K, throws: true): V;
    <K, V>(map: IMapMini<K, V>, key: K, throws?: boolean): V | undefined;
} = <K, V>(map: IMapMini<K, V>, key: K, throws = false) => {
    assert(!throws || map.has(key), "[pickMap] Key not found", {key});
    const result = map.get(key);
    map.delete(key);
    return result;
};

export const ensureMap = <K, V>(map: IMapMini<K, V>, key: K, initializer?: XMapInitializer<K, V>): V => {
    if (map.has(key)) {
        return map.get(key) as V;
    }

    assert(isFunction(initializer), "[ensureMap] Initializer is not a function", {key});
    const value = initializer(key);
    map.set(key, value);
    return value;
};

export const insertSet = <T>(set: ISetMini<T>, value: T) => {
    if (set.has(value)) {
        return false;
    }

    set.add(value);
    return true;
};

export const pickSet: {
    <T>(set: ISetMini<T>, value: T, strict: true): T;
    <T>(set: ISetMini<T>, value: T, strict?: boolean): T | undefined;
} = <T>(set: ISetMini<T>, value: T, throws = false) => {
    if (set.has(value)) {
        set.delete(value);
        return value;
    }
    assert(!throws, "[pickSet] Value not found", {value});
};
