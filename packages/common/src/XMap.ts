import {Obj} from "./Obj";
import {Var} from "./Var";

export type XMapInitializer<K, V> = (key: K) => V;
export type XMapSource<K = any, V = any> = Iterable<[K, V]> | ArrayLike<[K, V]> | Record<Extract<K, PropertyKey>, V>;

export interface IMapMini<K, V> {
    delete(key: K): boolean;

    get(key: K): V | undefined;

    has(key: K): boolean;

    set(key: K, value: V): this;
}

export class XMap<K = any, V = any> extends Map<K, V> {
    protected initializer?: XMapInitializer<K, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);
    constructor(...args: any[]) {
        const [src, initializer] = XMap.parseArgs(args);
        super(src);

        this.initializer = initializer;
    }

    public static parseArgs(args: any[]): [Array<[any, any]>, XMapInitializer<any, any> | undefined] {
        const [src, initializer] = args;

        if (Var.isFunction(src)) {
            return [[], src];
        }

        return [XMap.normalizeSource(src), initializer];
    }

    public static normalizeSource<K, V>(src?: XMapSource<K, V>): Array<[K, V]> {
        if (!src) {
            return [];
        }

        if (Var.isPlainObject(src)) {
            return Obj.entries(src) as any;
        }

        return Array.from(src as any);
    }

    public static pick<K, V>(map: IMapMini<K, V>, key: K, strict: true): V;
    public static pick<K, V>(map: IMapMini<K, V>, key: K, strict?: boolean): V | undefined;
    public static pick<K, V>(map: IMapMini<K, V>, key: K, throws = false) {
        if (throws && !map.has(key)) {
            throw new Error(`Key ${key} not found`);
        }
        const result = map.get(key);
        map.delete(key);
        return result;
    }

    public static ensure<K, V>(map: IMapMini<K, V>, key: K, initializer: XMapInitializer<K, V>) {
        if (!map.has(key)) {
            if (!Var.isFunction(initializer)) {
                throw new Error(`Could not ensure key "${key}" - initializer is not a function`);
            }

            const value = initializer(key);

            map.set(key, value);
        }

        return map.get(key)!;
    }

    public static sort<K, V>(map: Map<K, V>, compareFn: (a: [K, V], b: [K, V]) => number) {
        const entries = [...map.entries()];

        entries.sort(compareFn);

        map.clear();

        for (const [key, value] of entries) {
            map.set(key, value);
        }

        return map;
    }

    public ensure(key: K, initializer?: XMapInitializer<K, V>) {
        return XMap.ensure(this, key, initializer || this.initializer!);
    }

    public sort(compareFn: (a: [K, V], b: [K, V]) => number) {
        XMap.sort(this, compareFn);
        return this;
    }

    public toObject(): Record<K & PropertyKey, V> {
        const result: any = {};

        for (const [key, value] of this) {
            if (!Var.isPropertyKey(key)) {
                throw new Error(`Could not convert map to object. ${key} is not a number|string|symbol`);
            }
            result[key] = value;
        }

        return result;
    }

    public pick(key: K, strict: true): V;
    public pick(key: K, strict?: boolean): V | undefined;
    public pick(key: K, strict = false) {
        return XMap.pick(this, key, strict);
    }
}
