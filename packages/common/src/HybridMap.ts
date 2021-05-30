import {Primitive} from "@sirian/ts-extra-types";
import {isPrimitive} from "./Is";
import {XMap} from "./XMap";
import {ensureMap, HybridMapStore, IMapMini, parseMapArgs, pickMap, XMapInitializer, XMapSource} from "./XUtils";
import {XWeakMap} from "./XWeakMap";

export class HybridMap<K, V> implements IMapMini<K, V> {
    private readonly _initializer?: XMapInitializer;
    private readonly _strongMap: XMap<K & Primitive, V> = new XMap();
    private _weakMap: XWeakMap<K & object, V> = new XWeakMap();

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);

    constructor(...args: any[]) {
        const [src, initializer] = parseMapArgs(args);
        this._initializer = initializer;
        src.forEach(([key, value]) => this.set(key, value));
    }

    public ensure(key: K, initializer?: () => V) {
        return ensureMap(this, key, initializer ?? this._initializer);
    }

    public pick(key: K, throws: true): V;
    public pick(key: K, throws?: boolean): V | undefined;
    public pick(key: K, throws = false) {
        return pickMap(this, key, throws);
    }

    public get(key: K) {
        return this._getMap(key).get(key);
    }

    public has(key: K) {
        return this._getMap(key).has(key);
    }

    public set(key: K, value: V) {
        this._getMap(key).set(key, value);

        return this;
    }

    public delete(key: K) {
        return this._getMap(key).delete(key);
    }

    public clear() {
        this._strongMap.clear();
        this._weakMap = new XWeakMap();

        return this;
    }

    private _getMap(key: K) {
        return (isPrimitive(key) ? this._strongMap : this._weakMap) as HybridMapStore<K, V>;
    }
}
