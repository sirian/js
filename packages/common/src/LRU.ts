import {firstN} from "./Arr";

export class LRU<K, V> extends Map<K, V> {
    private readonly _maxSize: number;

    constructor(maxSize: number) {
        super();
        this._maxSize = maxSize;
    }

    public set(key: K, v: V) {
        this.delete(key);

        const extra = this.size - this._maxSize + 1;
        if (extra > 0) {
            firstN(this.keys(), extra).forEach((k) => this.delete(k));
        }

        super.set(key, v);

        return this;
    }

    public get(key: K) {
        if (this.has(key)) {
            const v = super.get(key) as V;
            this.set(key, v);
            return v;
        }
    }
}
