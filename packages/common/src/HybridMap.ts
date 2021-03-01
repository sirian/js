import {isObjectOrFunction} from "./Is";
import {IMapMini, parseMapArgs, XMap, XMapInitializer, XMapSource} from "./XMap";
import {XWeakMap} from "./XWeakMap";

export type HybridMapStore<K, V> = K extends object ? XWeakMap<any, V> : XMap<any, V>;

export class HybridMap<K, V> implements IMapMini<K, V> {
    private readonly _strongMap: XMap<any, V>;
    private _weakMap: XWeakMap<any, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);

    constructor(...args: any[]) {
        const [src, initializer] = parseMapArgs(args);

        this._weakMap = new XWeakMap(initializer);
        this._strongMap = new XMap(initializer);

        for (const [key, value] of src) {
            this.set(key, value);
        }
    }

    public ensure(key: K, initializer?: () => V) {
        return this.getMap(key).ensure(key, initializer);
    }

    public pick(key: K, strict: true): V;
    public pick(key: K, strict?: boolean): V | undefined;
    public pick(key: K, strict = false) {
        return XMap.pick(this, key, strict);
    }

    public get(key: K) {
        return this.getMap(key).get(key);
    }

    public has(key: K) {
        return this._strongMap.has(key) || this._weakMap.has(key);
    }

    public set(key: K, value: V) {
        this.getMap(key).set(key, value);

        return this;
    }

    public delete(key: K) {
        return this._weakMap.delete(key) || this._strongMap.delete(key);
    }

    public clear() {
        this._strongMap.clear();
        this._weakMap = new XWeakMap();
    }

    public getMap(key: K) {
        return (isObjectOrFunction(key) ? this._weakMap : this._strongMap) as HybridMapStore<K, V>;
    }
}
