import {entriesOf, hasMethod, hasProp, isArray, isNullish, isString, keysOf, valuesOf} from "@sirian/common";
import {IterableEntries, IterableKeys, IterableValues, ObjEntryOf, ObjKeyOf, ObjValueOf} from "@sirian/ts-extra-types";

type KVValues<T> =
    T extends string ? string[] :
    T extends IterableValues<infer V> ? V[] :
    T extends object ? Array<ObjValueOf<T>> :
    [];

type KVEntries<T> =
    T extends string ? Array<[number, string]> :
    T extends IterableEntries<infer E> ? E[] :
    T extends object ? Array<ObjEntryOf<T>> :
    unknown;

type KVKeys<T> =
    T extends string ? Array<[number, string]> :
    T extends IterableKeys<infer E> ? E[] :
    T extends object ? Array<ObjKeyOf<T>> :
    [];

export class KV {
    public static values<T>(value: T): KVValues<T> {
        if (isNullish(value)) {
            return [] as KVValues<T>;
        }
        if (hasMethod(value, "values")) {
            return [...value.values()] as KVValues<T>;
        }

        if (isArray(value)) {
            return [...value] as KVValues<T>;
        }

        return valuesOf(value) as KVValues<T>;
    }

    public static keys<T>(value: T): KVKeys<T> {
        if (isNullish(value)) {
            return [] as KVKeys<T>;
        }
        if (isString(value)) {
            return KV.keys([...value]) as KVKeys<T>;
        }

        if (hasMethod(value, "keys")) {
            return [...value.keys()] as KVKeys<T>;
        }

        return [...keysOf(value)] as KVKeys<T>;
    }

    public static entries<T>(value: T): KVEntries<T> {
        if (isNullish(value)) {
            return [] as KVEntries<T>;
        }
        if (isString(value)) {
            return KV.entries([...value]) as KVEntries<T>;
        }
        if (hasMethod(value, "entries")) {
            return [...value.entries()] as KVEntries<T>;
        }

        return entriesOf(value) as KVEntries<T>;
    }

    public static size<T>(value: T) {
        if (isNullish(value)) {
            return 0;
        }
        if (hasProp(value, "length")) {
            return value.length;
        }

        if (hasMethod(value, "size")) {
            return value.size();
        }

        return KV.keys(value).length;
    }
}
