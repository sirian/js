import {
    FromEntries,
    ObjectZip,
    ObjEntryOf,
    ObjKeyOf,
    ObjValueOf,
    ToPrimitive,
    UnionToIntersection,
    Wrap,
} from "@sirian/ts-extra-types";
import {Ref} from "./Ref";
import {Var} from "./Var";

const objToString = Object.prototype.toString;

export type MapCallback<T1> = <K1 extends keyof T1>(value: T1[K1], key: K1) => any;
export type MapResult<T, C> = {
    [P in keyof T]: C extends (value: T[P], key: P) => infer U ? U : never
};

export const Obj = new class {
    public stringify(target: object) {
        return objToString.call(target);
    }

    public assign<T extends object, U extends any[]>(target: T, ...src: U): T & UnionToIntersection<U[number]> {
        return Object.assign(target, ...src);
    }

    public replace<T extends object>(target: T, ...sources: Array<Partial<T>>) {
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

    public keys<T>(target: T) {
        return Object.keys(target) as Array<ObjKeyOf<T>>;
    }

    public values<T>(target: T) {
        return Object.values(target) as Array<ObjValueOf<T>>;
    }

    public entries<T>(target: T) {
        return Object.entries(target) as Array<ObjEntryOf<T>>;
    }

    public create<T extends object>(o: T | null = null, properties: PropertyDescriptorMap = {}): T {
        return Object.create(o, properties);
    }

    public getStringTag(arg: any) {
        // extract "[object (.*)]"
        return Obj.stringify(arg).slice(8, -1);
    }

    public wrap<T>(value: T): Wrap<T> {
        return Object(value);
    }

    public toPrimitive<T>(target: T): ToPrimitive<T> {
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

    public fromEntries<E extends Array<[keyof any[], any]>>(entries: E): FromEntries<E> {
        return entries.reduce((obj, [key, value]) => {
            obj[key] = value;
            return obj;
        }, {} as any);
    }

    public isEmpty(obj: object) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const key in obj) { // tslint:disable-line:forin
            // noinspection JSUnfilteredForInLoop
            return !Ref.hasOwn(obj, key);
        }
        return true;
    }

    public zip<K extends Array<keyof any>, V extends any[]>(keys: K, values: V): ObjectZip<K, V> {
        return keys.reduce((obj, key, index) => {
            obj[key] = values[index];
            return obj;
        }, {} as any);
    }

    public pick<T, K extends keyof T>(target: T, keys: K[]): Pick<T, K> {
        return keys.reduce((obj, key) => {
            obj[key] = target[key];
            return obj;
        }, {} as any);
    }
};
