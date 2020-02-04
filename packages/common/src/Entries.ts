import {Entry, FromEntries, IterableEntries, ObjEntryOf} from "@sirian/ts-extra-types";
import {Obj} from "./Obj";
import {Ref} from "./Ref";
import {isNullable, isString} from "./Var";

export class Entries<T extends Entry> {
    protected items: T[];

    public constructor(entries: Iterable<T | undefined | null> = []) {
        this.items = Array.from(entries).filter((x) => !isNullable(x)) as T[];
    }

    public static from<E extends Entry>(value: IterableEntries<E>): Entries<E>;
    public static from(value: string): Entries<[number, string]>;
    public static from<T extends object>(value: T): Entries<ObjEntryOf<T>>;
    public static from(value: any) {
        if (isString(value)) {
            value = [...value];
        }

        const entries = Ref.hasMethod(value, "entries")
                        ? value.entries()
                        : Obj.entries(value);

        return new this(entries);
    }

    public map<R extends Entry>(callback: <E extends T>(key: E[0], value: E[1]) => R | undefined) {
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
