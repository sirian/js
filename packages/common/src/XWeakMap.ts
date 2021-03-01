import {parseMapArgs, XMap, XMapInitializer, XMapSource} from "./XMap";

export class XWeakMap<K extends object, V> extends WeakMap<K, V> {
    private readonly _initializer?: XMapInitializer<K, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);

    constructor(...args: any[]) {
        const [src, initializer] = parseMapArgs(args);

        super(src);

        this._initializer = initializer;
    }

    public ensure(key: K, initializer?: XMapInitializer<K, V>) {
        return XMap.ensure(this, key, initializer || this._initializer!);
    }

    public pick(key: K, strict: true): V;
    public pick(key: K, strict?: boolean): V | undefined;
    public pick(key: K, strict = false) {
        return XMap.pick(this, key, strict);
    }
}
