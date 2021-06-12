import {IMapMini} from "./XUtils";

export class NullMap<K = any, V = any> implements IMapMini<K, V> {
    public has() {
        return false;
    }

    public set() {
        return this;
    }

    public get(): undefined;
    public get() {}

    public delete(key: any) {
        return false;
    }
}
