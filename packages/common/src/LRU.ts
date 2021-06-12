import {firstN} from "./Arr";

export class LRU<K, V> {
    private readonly _maxSize: number;
    private readonly _map = new Map<K, V>();

    constructor(maxSize: number) {
        this._maxSize = maxSize;
    }

    public set(key: K, v: V) {
        const map = this._map;

        map.delete(key);

        const extra = this.size - this._maxSize + 1;
        if (extra > 0) {
            firstN(map.keys(), extra).forEach((k) => map.delete(k));
        }

        map.set(key, v);

        return this;
    }

    public get size() {
        return this._map.size;
    }

    public keys() {
        return [...this._map.keys()];
    }

    public get(key: K) {
        const map = this._map;

        if (map.has(key)) {
            const v = map.get(key) as V;
            this.set(key, v);
            return v;
        }
    }

    public has(key: any) {
        return this._map.has(key);
    }
}
