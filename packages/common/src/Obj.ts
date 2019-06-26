import {FromEntries, ObjEntryOf, ObjKeyOf, ObjValueOf, ToPrimitive, UnionToIntersection} from "@sirian/ts-extra-types";
import {_Object, _Symbol} from "./native";
import {Ref} from "./Ref";
import {Var} from "./Var";

const objToString = _Object.prototype.toString;

export type MapCallback<T1> = <K1 extends keyof T1>(value: T1[K1], key: K1) => any;
export type MapResult<T, C> = {
    [P in keyof T]: C extends (value: T[P], key: P) => infer U ? U : never
};

export class Obj {
    public static stringify(target: object) {
        return objToString.call(target);
    }

    public static assign<T extends object, U extends any[]>(target: T, ...src: U): T & UnionToIntersection<U[number]> {
        return _Object.assign(target, ...src);
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
        return _Object.keys(target) as Array<ObjKeyOf<T>>;
    }

    public static values<T>(target: T) {
        return _Object.values(target) as Array<ObjValueOf<T>>;
    }

    public static entries<T>(target: T) {
        return _Object.entries(target) as Array<ObjEntryOf<T>>;
    }

    public static create<T extends object>(o: T | null = null, properties?: PropertyDescriptorMap): T {
        return _Object.create(o, properties as any); // todo: typescript typings bug
    }

    public static getStringTag(arg: any) {
        // extract "[object (.*)]"
        return Obj.stringify(arg).slice(8, -1);
    }

    public static wrap(value: any) {
        return _Object(value);
    }

    public static toPrimitive<T>(target: T): ToPrimitive<T> {
        if (Var.isPrimitive(target)) {
            return target as ToPrimitive<T>;
        }

        const toPrimitve = _Symbol.toPrimitive;

        if (Ref.hasMethod(target, toPrimitve)) {
            return (target as any)[toPrimitve]("default");
        }

        if (Ref.hasMethod(target, "valueOf")) {
            return (target as any).valueOf();
        }

        throw new Error(`Could not convert ${Obj.getStringTag(target)} to primitive value`);
    }

    public static fromEntries<E extends Array<[keyof any[], any]>>(entries: E): FromEntries<E> {
        const record: any = {};

        for (const [key, value] of entries) {
            record[key] = value;
        }

        return record;
    }

    public static map<T, C extends MapCallback<T>>(obj: T, callback: C) {
        const accumulator: any = {};

        for (const [key, value] of Obj.entries(obj)) {
            accumulator[key] = callback(value as any, key as any);
        }
        return accumulator as MapResult<T, C>;
    }

    public static isEmpty(obj: object) {
        // noinspection LoopStatementThatDoesntLoopJS
        for (const key in obj) { // tslint:disable-line:forin
            // noinspection JSUnfilteredForInLoop
            return !Ref.hasOwn(obj, key);
        }
        return true;
    }
}
