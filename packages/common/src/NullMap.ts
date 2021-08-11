import {IMapMini} from "./utils";

export class NullMap<K, V> implements IMapMini<K, V> {
    public has(key: K): boolean;
    public has() {
        return false;
    }

    public set(key: K, value: V): this;
    public set() {
        return this;
    }

    public get(key: K): V | undefined;
    public get(): any {}

    public delete(key: K): boolean;
    public delete() {
        return false;
    }
}
