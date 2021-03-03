import {first} from "./Arr";
import {insertSet, pickSet} from "./XSetUtils";

export class XSet<T> extends Set<T> {
    public first() {
        return first(this);
    }

    public add(...values: T[]) {
        values.forEach((v) => super.add(v));
        return this;
    }

    public insert(value: T) {
        return insertSet(this, value);
    }

    public pick(value: T, strict: true): T;
    public pick(value: T, strict?: boolean): T | undefined;
    public pick(value: T, strict = false) {
        return pickSet(this, value, strict);
    }

    public toArray(): T[] {
        return [...this];
    }
}
