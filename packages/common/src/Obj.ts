import {
    AnyKey,
    ArrayRO,
    Assign,
    Entry,
    ExtractByObjectTag,
    FromEntries,
    ObjectZip,
    ObjEntryOf,
    ObjKeyOf,
    ObjValueOf,
} from "@sirian/ts-extra-types";
import {isArray, isPrimitive} from "./Is";
import {
    deleteProp,
    deleteProps,
    getObjectTag,
    getPrototypes,
    hasOwn,
    hasProp,
    ownDescriptor,
    ownKeys,
    ownNames,
} from "./Ref";

export interface SnapshotOptions {
    maxDepth?: number;
    stopAt?: object;
}

export const keysOf = <T>(target: T) => Object.keys(target) as Array<ObjKeyOf<T>>;
export const valuesOf = <T>(target: T) => Object.values(target) as Array<ObjValueOf<T>>;
export const entriesOf = <T>(target: T) => Object.entries(target) as Array<ObjEntryOf<T>>;

export const assign = <T extends any, U extends any[]>(target: T, ...sources: U): Assign<T, U> =>
    sources
        .reduce((o, source) => Object.assign(o, source, pick(source, keysOf(o))), target);

export const fromEntries = <E extends Iterable<Entry>>(entries: E) =>
    Object.fromEntries(entries) as FromEntries<E>;

export const objMap = <T, E extends Entry>(obj: T, fn: <K extends keyof T>(k: K, v: T[K]) => E | false) =>
    fromEntries(entriesOf(obj).map(([k, v]: any) => fn(k, v)).filter((element) => isArray(element)) as E[]);

export const pickEntries = <T, K extends keyof T>(target: T, keys: Iterable<K>) =>
    [...keys]
        .filter((k) => hasProp(target, k))
        .map((k) => [k, target[k]] as [K, T[K]]);

export const pick = <T, K extends keyof T>(target: T, keys: Iterable<K>) =>
    fromEntries(pickEntries(target, keys)) as Pick<T, K>;

export const omit = <T, K extends keyof T>(target: T, keys: Iterable<K>) => {
    target = {...target};
    deleteProps(target, ...keys);
    return target;
};

export const isObjectTag = <O, T extends string>(obj: O, tag: T): obj is ExtractByObjectTag<O, T> =>
    tag === getObjectTag(obj);

export const objZip = <K extends ArrayRO<AnyKey>, V extends ArrayRO>(keys: K, values: V) =>
    fromEntries(keys.map((k, i) => [k, values[i]])) as ObjectZip<K, V>;

export const objSnapshot = <T>(target: T, options: SnapshotOptions = {}): T => {
    if (isPrimitive(target)) {
        return target;
    }

    const protoKeys = getPrototypes(target, options)
        .flatMap((x) => ownNames(x).filter((k) => "__proto__" !== k && ownDescriptor(x, k)?.get)) as Array<keyof T>;

    return pick(target, [...keysOf(target), ...protoKeys] as Array<keyof T>);
};

export const objReplace = <T extends object>(target: T, ...sources: Array<Partial<T>>) =>
    assign(target, ...sources.map((s) => pick(s, keysOf(target) as Array<keyof T>)));

export const objClear = <T extends object>(target: T): Partial<T> => {
    if (isArray(target)) {
        target.length = 0;
    }
    ownKeys(target).forEach((key) => deleteProp(target, key));

    return target as Partial<T>;
};

export const isEmptyObject = (obj: object) => {
    // noinspection LoopStatementThatDoesntLoopJS
    for (const key in obj) {
        // noinspection JSUnfilteredForInLoop
        return !hasOwn(obj, key);
    }

    return true;
};
