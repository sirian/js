import {Iter} from "./Iter";

export abstract class BaseIterator<V> {
    public toArray() {
        return Iter.toArray(this);
    }

    public abstract [Symbol.asyncIterator](): AsyncIterator<V>;
}
