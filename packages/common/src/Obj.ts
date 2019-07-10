import {FromEntries, ObjectZip, ObjEntryOf, ObjKeyOf, ObjValueOf, ToPrimitive, Wrap} from "@sirian/ts-extra-types";
import {Ref} from "./Ref";
import {Var} from "./Var";

export class Obj {
    public static stringify(target: object) {
        return Object.prototype.toString.call(target);
    }

    public static replace<T extends object>(target: T, ...sources: Array<Partial<T>>) {
        for (const source of sources) {
            for (const [key, value] of Obj.entries(source)) {
                if (Var.isUndefined(value)) {
                    continue;
                }
                if (Ref.hasOwn(target, key)) {
                    target[key] = value as any;
                }
            }
        }
        return target;
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

    public static create<T extends object>(o: T | null = null, properties: PropertyDescriptorMap = {}): T {
        return Object.create(o, properties);
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

        const toPrimitve = Symbol.toPrimitive;

        if (Ref.hasMethod(target, toPrimitve)) {
            return (target as any)[toPrimitve]("default");
        }

        if (Ref.hasMethod(target, "valueOf")) {
            return (target as any).valueOf();
        }

        throw new Error(`Could not convert ${Obj.getStringTag(target)} to primitive value`);
    }

    public static fromEntries<E extends [keyof any, any]>(entries: E[]): FromEntries<E> {
        return entries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as any);
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
            obj[key] = target[key];
            return obj;
        }, {} as any);
    }
}
