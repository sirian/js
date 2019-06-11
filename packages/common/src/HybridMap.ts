import {IMapMini, XMap, XMapInitializer, XMapSource} from "./XMap";
import {XWeakMap} from "./XWeakMap";

export type HybridMapStore<K, V> = K extends object ? XWeakMap<any, V> : XMap<any, V>;

export class HybridMap<K, V> implements IMapMini<K, V> {
    public weakMap: XWeakMap<any, V>;
    public strongMap: XMap<any, V>;

    constructor(initializer?: XMapInitializer<K, V>);
    constructor(src: XMapSource<K, V>, initializer?: XMapInitializer<K, V>);

    constructor(...args: any[]) {
        const [src, initializer] = XMap.parseArgs(args);

        this.weakMap = new XWeakMap(initializer);
        this.strongMap = new XMap(initializer);

        for (const [key, value] of src) {
            this.set(key, value);
        }
    }

    public ensure(key: K, initializer?: () => V) {
        return this.getMapForKey(key).ensure(key, initializer);
    }

    public pick(key: K) {
        const result = this.get(key);
        this.delete(key);
        return result;
    }

    public get(key: K) {
        return this.getMapForKey(key).get(key);
    }

    public has(key: K) {
        return this.strongMap.has(key) || this.weakMap.has(key);
    }

    public set(key: K, value: V) {
        this.getMapForKey(key).set(key, value);

        return this;
    }

    public delete(key: K) {
        return this.weakMap.delete(key) || this.strongMap.delete(key);
    }

    public clear() {
        this.strongMap.clear();
        this.weakMap = new XWeakMap();
    }

    public getMapForKey(key: K) {
        if (key === null || "object" !== typeof key && "function" !== typeof key) {
            return this.strongMap as HybridMapStore<K, V>;
        }

        return this.weakMap as HybridMapStore<K, V>;
    }
}
