import {AbstractTransformIterator} from "./AbstractTransformIterator";
import {Iter} from "./Iter";
import {RecursiveContext} from "./RecursiveIterator";

export class NestedIterator<V> extends AbstractTransformIterator<V, RecursiveContext<V>> {
    protected transform(value: V) {
        return {
            value,
            hasChildren: () => Iter.isIterable(value) || Iter.isAsyncIterable(value),
            getChildren: (): NestedIterator<V> => new NestedIterator(value as any),
        };
    }
}
