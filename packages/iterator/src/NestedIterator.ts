import {isAsyncIterable, isIterable} from "@sirian/common";
import {AbstractTransformIterator} from "./AbstractTransformIterator";
import {RecursiveContext} from "./RecursiveIterator";

export class NestedIterator<V> extends AbstractTransformIterator<V, RecursiveContext<V>> {
    protected transform(value: V) {
        return {
            value,
            hasChildren: () => isIterable(value) || isAsyncIterable(value),
            getChildren: (): NestedIterator<V> => new NestedIterator(value as any),
        };
    }
}
