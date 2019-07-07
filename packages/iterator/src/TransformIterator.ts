import {AbstractTransformIterator} from "./AbstractTransformIterator";
import {AnyIterable} from "./Iter";

export class TransformIterator<V, R> extends AbstractTransformIterator<V, R> {
    protected callback: (value: V) => R;

    constructor(target: AnyIterable<V>, callback: (value: V) => R) {
        super(target);
        this.callback = callback;
    }

    protected transform(value: V): R {
        return this.callback(value);
    }
}
