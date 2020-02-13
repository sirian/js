import {
    Assign,
    FromEntries,
    ObjectZip,
    ObjEntryOf,
    ObjKeyOf,
    ObjValueOf,
    ToPrimitive,
    Wrap,
} from "@sirian/ts-extra-types";
import {deleteProp, getPrototypes, hasMethod, hasOwn, hasProp, ownDescriptors, ownKeys, ProtoChainOptions} from "./Ref";
import {stringifyObj} from "./Stringify";
import {isArray, isNullish, isObjectOrFunction, isPrimitive} from "./Var";
import {XSet} from "./XSet";

export type TypedPropertyDescriptorMap<U> = { [P in keyof U]: TypedPropertyDescriptor<U[P]> };

export interface SnapshotOptions {
    maxDepth?: number;
    stopAt?: object;
}

export const keysOf = Object.keys as <T>(target: T) => Array<ObjKeyOf<T>>;
export const valuesOf = Object.values as <T>(target: T) => Array<ObjValueOf<T>>;
export const entriesOf = Object.entries as <T>(target: T) => Array<ObjEntryOf<T>>;

export function assign<T extends any, U extends any[]>(target: T, ...sources: U): Assign<T, U>;
export function assign(target: any, ...sources: any[]) {
    const keySet = new XSet(keysOf(target));

    for (const source of sources) {
        if (isNullish(source)) {
            continue;
        }
        keySet.add(...keysOf(source));

        for (const key of keySet) {
            if (hasProp(source, key)) {
                target[key] = source[key] as any;
            }
        }
    }

    return target;
}

export class Obj {
    public static keys = keysOf;
    public static values = valuesOf;
    public static entries = entriesOf;

    public static stringify = stringifyObj;

    public static replace<T extends object>(target: T, ...sources: Array<Partial<T>>) {
        const k = keysOf(target) as Array<keyof T>;
        for (const source of sources) {
            assign(target, Obj.pick(source, k));
        }
        return target;
    }

    public static snapshot<T extends object>(target: T, options: SnapshotOptions = {}) {
        const keySet = new XSet(keysOf(target) as Array<keyof T>);

        const opts = {
            stopAt: Object.prototype,
            ...options,
        };

        const protoOpts: ProtoChainOptions = {
            self: true,
            stopAt: opts.stopAt,
            maxDepth: opts.maxDepth,
        };

        for (const x of getPrototypes(target, protoOpts)) {
            for (const [key, desc] of Obj.entries(ownDescriptors(x))) {
                if ("__proto__" === key) {
                    continue;
                }
                if (hasMethod(desc, "get")) {
                    keySet.add(key as keyof T);
                }
            }
        }

        return Obj.pick(target, [...keySet]);
    }

    public static create(o?: null): Record<any, any>;
    public static create<T extends object | null | undefined, U>(o: T, properties?: TypedPropertyDescriptorMap<U>): T & U;
    public static create(o?: object | null, properties: any = {}) {
        return Object.create(o || null, properties);
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

    public static getStringTag(arg: any) {
        // extract "[object (.*)]"
        return stringifyObj(arg).slice(8, -1);
    }

    public static wrap<T>(value: T): object & Wrap<T> {
        return isObjectOrFunction(value) ? value : Object(value);
    }

    public static toPrimitive<T>(target: T): ToPrimitive<T> {
        if (isPrimitive(target)) {
            return target as ToPrimitive<T>;
        }

        const toPrimitive = Symbol.toPrimitive;

        if (hasMethod(target, toPrimitive)) {
            return (target as any)[toPrimitive]("default");
        }

        if (hasMethod(target, "valueOf")) {
            return (target as any).valueOf();
        }

        throw new Error(`Could not convert ${Obj.getStringTag(target)} to primitive value`);
    }

    public static fromEntries<E extends [any, any]>(data: Iterable<E>): FromEntries<E[]> {
        const obj: any = {};
        for (const [key, value] of data) {
            obj[key] = value;
        }
        return obj;
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

    public static pick<T, K extends keyof T>(target: T, k: K[]): Pick<T, K> {
        return k.reduce((obj, key) => {
            if (hasProp(target, key)) {
                obj[key] = target[key];
            }
            return obj;
        }, {} as any);
    }
}
