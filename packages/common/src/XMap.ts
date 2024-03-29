import {parseMapArgs} from "./internal";
import {fromEntries} from "./obj";
import {isEqual} from "./var";
import {ensureMap, pickMap, sortMap, sortMapBy, XMapInitializer, XMapSource} from "./utils";

export class XMap<K = any, V = any> extends Map<K, V> {
    private readonly _initializer?: XMapInitializer<K, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);
    constructor(...args: any[]) {
        const [src, initializer] = parseMapArgs(...args);
        super(src);

        this._initializer = initializer;
    }

    public ensure(key: K, initializer?: XMapInitializer<K, V>) {
        return ensureMap(this, key, initializer ?? this._initializer);
    }

    public sort(compareFn: (a: [K, V], b: [K, V]) => number) {
        sortMap(this, compareFn);
        return this;
    }

    public sortBy(fn: (k: K, v: V) => unknown) {
        sortMapBy(this, fn);
        return this;
    }

    public toObject() {
        return fromEntries(this.entries()) as Record<K & PropertyKey, V>;
    }

    public pick(key: K, throws: true): V;
    public pick(key: K, throws?: boolean): V | undefined;
    public pick(key: K, throws = false) {
        return pickMap(this, key, throws);
    }

    public deleteStrict(key: K, value: V) {
        return this.has(key) && isEqual(value, this.get(key)) && this.delete(key);
    }
}
