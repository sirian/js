import {Entry, FromEntries, IterableEntries, ObjEntryOf} from "@sirian/ts-extra-types";
import {toArray} from "./Arr";
import {isNotNullish, isString} from "./Is";
import {entriesOf, fromEntries} from "./Obj";
import {hasMethod} from "./Ref";

export class Entries<T extends Entry> {
    private readonly _items: T[];

    public constructor(entries: Iterable<T | undefined | null> = []) {
        this._items = toArray(entries).filter(isNotNullish);
    }

    public static from(value: string): Entries<Entry<number, string>>;
    public static from<E extends Entry>(value: IterableEntries<E>): Entries<E>;
    public static from<T extends object>(value: T): Entries<ObjEntryOf<T>>;
    public static from(value: unknown) {
        if (isString(value)) {
            return Entries.from([...value]);
        }

        return new Entries(hasMethod(value, "entries") ? value.entries() : entriesOf(value));
    }

    public map<R extends Entry>(callback: <E extends T>(key: E[0], value: E[1]) => R | undefined) {
        const items = this._items.map(([key, value]) => callback(key, value));
        return new Entries(items);
    }

    public toObject(): FromEntries<T[]> {
        return fromEntries(this._items);
    }

    public keys() {
        return this._items.map((e) => e[0]);
    }

    public values() {
        return this._items.map((e) => e[1]);
    }

    public entries() {
        return [...this._items];
    }

    public* [Symbol.iterator]() {
        return yield* this.entries();
    }
}
