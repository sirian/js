import {parseMapArgs} from "./internal";
import {ensureMap, pickMap, XMapInitializer, XMapSource} from "./utils";

export class XWeakMap<K extends object, V> extends WeakMap<K, V> {
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

    public pick(key: K, throws: true): V;
    public pick(key: K, throws?: boolean): V | undefined;
    public pick(key: K, throws = false) {
        return pickMap(this, key, throws);
    }
}
