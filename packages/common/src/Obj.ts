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
import {ProtoChainOptions, Ref} from "./Ref";
import {Var} from "./Var";
import {XSet} from "./XSet";

export class Obj {
    public static stringify(target: object) {
        return Object.prototype.toString.call(target);
    }

    public static assign<T, U extends any[]>(target: T, ...sources: U): Assign<T, U>;
    public static assign(target: any, ...sources: any[]) {
        const keys = new XSet(Obj.keys(target));
        for (const source of sources) {
            if (Var.isNullable(source)) {
                continue;
            }
            keys.add(...Obj.keys(source));

            for (const key of keys) {
                if (Ref.has(source, key)) {
                    target[key] = source[key] as any;
                }
            }
        }

        return target;
    }

    public static replace<T extends object>(target: T, ...sources: Array<Partial<T>>) {
        const keys = Obj.keys(target) as Array<keyof T>;
        for (const source of sources) {
            Obj.assign(target, Obj.pick(source, keys));
        }
        return target;
    }

    public static snapshot<T extends object>(target: T, options: ProtoChainOptions = {}) {
        const keys = new XSet<string>(Obj.keys(target));

        const opts = {
            stopAt: Object.prototype,
            ...options,
        };
        for (const x of Ref.getProtoChain(target, opts)) {
            for (const [key, desc] of Obj.entries(Ref.getOwnDescriptors(x))) {
                if ("__proto__" === key) {
                    continue;
                }
                if (Var.isFunction(desc.get)) {
                    keys.add(key);
                }
            }
        }

        return Obj.pick(target, [...keys] as Array<keyof T>) as T;
    }

    public static keys<T>(target: T) {
        return Object.keys(target) as Array<ObjKeyOf<T>>;
    }

    public static values<T>(target: T) {
        return Object.values(target) as Array<ObjValueOf<T>>;
    }

    public static entries<T>(target: T) {
        return Object.entries(target) as Array<ObjEntryOf<T>>;
    }

    // tslint:disable-next-line:max-line-length
    public static create<T extends object, U>(o: T | null = null, properties?: { [P in keyof U]: TypedPropertyDescriptor<U[P]> }): T & U {
        return Object.create(o, properties || {});
    }

    public static getStringTag(arg: any) {
        // extract "[object (.*)]"
        return Obj.stringify(arg).slice(8, -1);
    }

    public static wrap<T>(value: T): Wrap<T> {
        return Object(value);
    }

    public static toPrimitive<T>(target: T): ToPrimitive<T> {
        if (Var.isPrimitive(target)) {
            return target as ToPrimitive<T>;
        }

        const toPrimitive = Symbol.toPrimitive;

        if (Ref.hasMethod(target, toPrimitive)) {
            return (target as any)[toPrimitive]("default");
        }

        if (Ref.hasMethod(target, "valueOf")) {
            return (target as any).valueOf();
        }

        throw new Error(`Could not convert ${Obj.getStringTag(target)} to primitive value`);
    }

    public static fromEntries<E extends [any, any]>(entries: Iterable<E>): FromEntries<E[]> {
        const obj: any = {};
        for (const [key, value] of entries) {
            obj[key] = value;
        }
        return obj;
    }

    public static isEmpty(obj: object) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const key in obj) { // tslint:disable-line:forin
            // noinspection JSUnfilteredForInLoop
            return !Ref.hasOwn(obj, key);
        }
        return true;
    }

    public static zip<K extends Array<keyof any>, V extends any[]>(keys: K, values: V): ObjectZip<K, V> {
        return keys.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
        }, {} as any);
    }

    public static pick<T, K extends keyof T>(target: T, keys: K[]): Pick<T, K> {
        return keys.reduce((obj, key) => {
            if (Ref.has(target, key)) {
                obj[key] = target[key];
            }
            return obj;
        }, {} as any);
    }
}
