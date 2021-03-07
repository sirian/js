import {Nullish} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {assert} from "./Error";
import {isFunction} from "./Is";
import {entriesOf} from "./Obj";
import {isPlainObject} from "./Var";

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

export const parseMapArgs = (args: any[]): [Array<[any, any]>, XMapInitializer | undefined] => {
    const [src, initializer] = args;

    if (isFunction(src)) {
        return [[], src];
    }

    const entries = (isPlainObject(src) ? entriesOf(src) : toArray(src)) as Array<[any, any]>;

    return [entries, initializer];
};

export const sortMap = <K, V>(map: Map<K, V>, compareFn: (a: [K, V], b: [K, V]) => number) => {
    const entries = [...map.entries()].sort(compareFn);

    map.clear();

    entries.forEach(([key, value]) => map.set(key, value));

    return map;
};

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
    if (!map.has(key)) {
        assert(isFunction(initializer), "[ensureMap] Initializer is not a function", {key});
        map.set(key, initializer(key));
    }

    return map.get(key) as V;
};
