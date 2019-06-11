import {Obj, Ref, Var} from "@sirian/common";
import {EntriesOf, IterableEntries, IterableKeys, IterableValues, KeyOf, ValueOf} from "@sirian/ts-extra-types";

type KVValues<T> =
    T extends string ? string[] :
    T extends IterableValues<infer V> ? V[] :
    T extends object ? Array<ValueOf<T>> :
    [];

type KVEntries<T> =
    T extends string ? Array<[number, string]> :
    T extends IterableEntries<infer E> ? E[] :
    T extends object ? EntriesOf<T> :
    [];

type KVKeys<T> =
    T extends string ? Array<[number, string]> :
    T extends IterableKeys<infer E> ? E[] :
    T extends object ? Array<KeyOf<T>> :
    [];

export class KV {
    public static values<T>(value: T): KVValues<T> {
        if (Var.isNullable(value)) {
            return [] as KVValues<T>;
        }
        if (Ref.hasMethod(value, "values")) {
            return [...value.values()] as KVValues<T>;
        }

        if (Var.isArray(value)) {
            return [...value] as KVValues<T>;
        }

        return Obj.values(value) as KVValues<T>;
    }

    public static keys<T>(value: T): KVKeys<T> {
        if (Var.isNullable(value)) {
            return [] as KVKeys<T>;
        }
        if (Var.isString(value)) {
            return KV.keys([...value]) as KVKeys<T>;
        }

        if (Ref.hasMethod(value, "keys")) {
            return [...value.keys()] as KVKeys<T>;
        }

        return [...Obj.keys(value)] as KVKeys<T>;
    }

    public static entries<T>(value: T): KVEntries<T> {
        if (Var.isNullable(value)) {
            return [] as KVEntries<T>;
        }
        if (Var.isString(value)) {
            return KV.entries([...value]) as KVEntries<T>;
        }
        if (Ref.hasMethod(value, "entries")) {
            return [...value.entries()] as KVEntries<T>;
        }

        return Obj.entries(value) as KVEntries<T>;
    }

    public static size<T>(value: T) {
        if (Var.isNullable(value)) {
            return 0;
        }
        if (Ref.has(value, "length")) {
            return value.length;
        }

        if (Ref.hasMethod(value, "size")) {
            return value.size();
        }

        return KV.keys(value).length;
    }
}
