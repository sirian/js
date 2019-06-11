export class XSet<T> extends Set<T> {
    public static from<T>(v: Iterable<T>) {
        return new this(v);
    }

    public first() {
        for (const x of this) {
            return x;
        }
    }

    public add(...values: T[]) {
        for (const value of values) {
            super.add(value);
        }
        return this;
    }

    public toArray(): T[] {
        return [...this];
    }
}
