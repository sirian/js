import {Var} from "@sirian/common";
import {AbstractTransformIterator} from "./AbstractTransformIterator";
import {RecursiveContext} from "./RecursiveIterator";

export class NestedIterator<V> extends AbstractTransformIterator<V, RecursiveContext<V>> {
    protected transform(value: V) {
        return {
            value,
            hasChildren: () => Var.isIterable(value) || Var.isAsyncIterable(value),
            getChildren: (): NestedIterator<V> => new NestedIterator(value as any),
        };
    }
}
