export interface ISetMini<T> {
    delete(value: T): boolean;

    has(value: T): boolean;

    add(value: T): this;
}

export class XSet<T> extends Set<T> {
    public static from<T>(v: Iterable<T>) {
        return new this(v);
    }

    public static pick<T>(set: ISetMini<T>, value: T, strict: true): T;
    public static pick<T>(set: ISetMini<T>, value: T, strict?: boolean): T | undefined;
    public static pick<T>(set: ISetMini<T>, value: T, throws = false) {
        if (set.has(value)) {
            set.delete(value);
            return value;
        }
        if (throws) {
            throw new Error(`Value ${value} not found`);
        }
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

    public insert(value: T) {
        if (this.has(value)) {
            return false;
        }

        this.add(value);
        return true;
    }

    public pick(value: T, strict: true): T;
    public pick(value: T, strict?: boolean): T | undefined;
    public pick(value: T, strict = false) {
        return XSet.pick(this, value, strict);
    }

    public toArray(): T[] {
        return [...this];
    }

    public pickAll() {
        const result = [...this];
        this.clear();
        return result;
    }
}
