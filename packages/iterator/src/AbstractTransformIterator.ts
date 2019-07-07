import {BaseIterator} from "./BaseIterator";
import {AnyIterable} from "./Iter";

export abstract class AbstractTransformIterator<V, R> extends BaseIterator<R> {
    protected target: AnyIterable<V>;

    constructor(target: AnyIterable<V>) {
        super();
        this.target = target;
    }

    public* [Symbol.iterator]() {
        for (const x of this.target as any) {
            yield this.transform(x);
        }
    }

    public async* [Symbol.asyncIterator]() {
        for await (const x of this.target) {
            yield this.transform(x);
        }
    }

    protected abstract transform(value: V): R;
}
