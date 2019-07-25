import {FromEntries, IterableEntries, ObjEntryOf} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {Var} from "./Var";

export class Entries<T extends [any, any]> {
    protected items: T[];

    public constructor(entries: Iterable<T | undefined | null> = []) {
        this.items = Array.from(entries).filter((x) => !Var.isNullable(x)) as T[];
    }

    public static from<E extends [any, any]>(value: IterableEntries<E>): Entries<E>;
    public static from(value: string): Entries<[number, string]>;
    public static from<T extends object>(value: T): Entries<ObjEntryOf<T>>;
    public static from(value: any) {
        if (Var.isString(value)) {
            value = [...value];
        }
        if (Ref.hasMethod(value, "entries")) {
            return new this(value.entries());
        }

        return this.fromObject(value);
    }

    public static fromObject<T extends object>(target: T) {
        return new this(Obj.entries(target)) as Entries<ObjEntryOf<T>>;
    }

    public map<R extends [any, any]>(callback: <E extends T>(key: E[0], value: E[1]) => R | undefined) {
        const items = this.items.map(([key, value]) => callback(key, value));
        return new Entries(items);
    }

    public toObject(): FromEntries<T[]> {
        return Obj.fromEntries(this.items);
    }

    public keys() {
        return this.items.map((e) => e[0]);
    }

    public values() {
        return this.items.map((e) => e[1]);
    }

    public entries() {
        return [...this.items];
    }
}
