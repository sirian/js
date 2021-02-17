import {
    AnyKey,
    Assign,
    Entry,
    ExtractByObjectTag,
    FromEntries,
    ObjectZip,
    ObjEntryOf,
    ObjKeyOf,
    ObjValueOf,
    ToPrimitive,
    Wrap,
} from "@sirian/ts-extra-types";
import {isArray, isNullish, isPrimitive} from "./Is";
import {
    deleteProp,
    getPrototypes,
    hasMethod,
    hasOwn,
    hasProp,
    ownDescriptors,
    ownKeys,
    ProtoChainOptions,
} from "./Ref";
import {stringifyObj} from "./Stringify";

export interface SnapshotOptions {
    maxDepth?: number;
    stopAt?: object;
}

export const keysOf = <T>(target: T) => Object.keys(target) as Array<ObjKeyOf<T>>;
export const valuesOf = <T>(target: T) => Object.values(target) as Array<ObjValueOf<T>>;
export const entriesOf = <T>(target: T) => Object.entries(target) as Array<ObjEntryOf<T>>;

export function assign<T extends any, U extends any[]>(target: T, ...sources: U): Assign<T, U> {
    const keySet = new Set<AnyKey>(keysOf(target));

    for (const source of sources) {
        if (isNullish(source)) {
            continue;
        }
        keysOf(source).forEach((key) => keySet.add(key));

        for (const key of keySet) {
            if (hasProp(source, key)) {
                (target as any)[key] = source[key];
            }
        }
    }

    return target as any;
}

export const toPrimitive = <T>(target: T): ToPrimitive<T> => {
    if (isPrimitive(target)) {
        return target as ToPrimitive<T>;
    }

    const symbol = Symbol.toPrimitive;

    if (hasMethod(target, symbol)) {
        return (target as any)[symbol]("default");
    }

    if (hasMethod(target, "valueOf")) {
        return (target as any).valueOf();
    }

    throw new Error(`Could not convert ${getObjectTag(target)} to primitive value`);
};

export const toObject = <T>(value: T): object & Wrap<T> => Object(value);

export const fromEntries = <E extends Entry>(data: E[] | Iterable<E>): FromEntries<E[]> => {
    const obj: any = {};
    for (const [key, value] of data) {
        obj[key] = value;
    }
    return obj as FromEntries<E[]>;
};

export const getObjectTag = (arg: any) => stringifyObj(arg).replace(/]$|^\[object /g, "");

export const pick = <T, K extends keyof T>(target: T, k: Iterable<K>): Pick<T, K> => {
    const obj: any = {};
    for (const key of k) {
        if (hasProp(target, key)) {
            obj[key] = target[key];
        }
    }
    return obj;
};

export const isObjectTag = <O, T extends string>(obj: O, tag: T): obj is ExtractByObjectTag<O, T> =>
    tag === getObjectTag(obj);

export class Obj {
    public static replace<T extends object>(target: T, ...sources: Array<Partial<T>>) {
        const k = keysOf(target) as Array<keyof T>;
        for (const source of sources) {
            assign(target, pick(source, k));
        }
        return target;
    }

    public static snapshot<T extends object>(target: T, options: SnapshotOptions = {}) {
        const keySet = new Set(keysOf(target) as Array<keyof T>);

        const protoOpts: ProtoChainOptions = {
            self: true,
            stopAt: Object.prototype,
            ...options,
        };

        for (const x of getPrototypes(target, protoOpts)) {
            for (const [key, desc] of entriesOf(ownDescriptors(x))) {
                if ("__proto__" === key) {
                    continue;
                }
                if (hasMethod(desc, "get")) {
                    keySet.add(key as keyof T);
                }
            }
        }

        return pick(target, [...keySet]);
    }

    public static clear<T extends object>(target: T): Partial<T> {
        if (isArray(target)) {
            target.length = 0;
        }

        for (const key of ownKeys(target)) {
            deleteProp(target, key);
        }

        return target as Partial<T>;
    }

    public static isEmpty(obj: object) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const key in obj) { // tslint:disable-line:forin
            // noinspection JSUnfilteredForInLoop
            return !hasOwn(obj, key);
        }

        return true;
    }

    public static zip<K extends PropertyKey[], V extends any[]>(k: K, v: V): ObjectZip<K, V> {
        return k.reduce((obj, key, index) => {
            obj[key] = v[index];
            return obj;
        }, {} as any);
    }
}
