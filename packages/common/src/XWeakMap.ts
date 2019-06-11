import {XMap, XMapInitializer, XMapSource} from "./XMap";

export class XWeakMap<K extends object, V> extends WeakMap<K, V> {
    protected initializer?: XMapInitializer<K, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);

    constructor(...args: any[]) {
        const [src, initializer] = XMap.parseArgs(args);

        super(src);

        this.initializer = initializer;
    }

    public ensure(key: K, initializer?: XMapInitializer<K, V>) {
        return XMap.ensure(this, key, initializer || this.initializer!);
    }

    public pick(key: K) {
        return XMap.pick(this, key);
    }
}
