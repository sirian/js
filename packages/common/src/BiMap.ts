import {XMap} from "./XMap";
import {XSet} from "./XSet";

export class BiMap<K = any, V = any> extends XMap<K, V> {
    protected reverse: XMap<V, XSet<K>> = new XMap(() => new XSet());

    public clear() {
        this.reverse.clear();
        super.clear();
    }

    public delete(key: K) {
        if (this.has(key)) {
            this._unregister(key, this.get(key)!);
        }
        return super.delete(key);
    }

    public hasValue(value: V) {
        return this.reverse.has(value);
    }

    public set(key: K, value: V): this {
        if (this.has(key)) {
            const old = this.get(key)!;
            if (old !== value) {
                this._unregister(key, old);
            }
        }
        this.reverse.ensure(value).add(key);
        return super.set(key, value);
    }

    private _unregister(key: K, value: V) {
        const keys = this.reverse.get(value);
        keys?.delete(key);
        if (!keys?.size) {
            this.reverse.delete(value);
        }
    }
}
