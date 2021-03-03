import {insertSet, pickSet} from "./XSetUtils";

export class XWeakSet<T extends object> extends WeakSet<T> {
    public add(...values: T[]) {
        values.forEach((v) => super.add(v));
        return this;
    }

    public pick(value: T, throws: true): T;
    public pick(value: T, throws?: boolean): T | undefined;
    public pick(value: T, throws = false) {
        return pickSet(this, value, throws);
    }

    public insert(value: T) {
        return insertSet(this, value);
    }
}
