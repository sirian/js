import {XSet} from "./XSet";

export class XWeakSet<T extends object> extends WeakSet<T> {
    public add(...values: T[]) {
        for (const value of values) {
            super.add(value);
        }
        return this;
    }

    public pick(value: T, strict: true): T;
    public pick(value: T, strict?: boolean): T | undefined;
    public pick(value: T, strict = false) {
        return XSet.pick(this, value, strict);
    }
}
