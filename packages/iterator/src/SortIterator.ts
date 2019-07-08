import {BaseIterator} from "./BaseIterator";
import {AnyIterable} from "./Iter";

export class SortIterator<V> extends BaseIterator<V> {
    protected callback: (a: V, b: V) => number;
    protected target: AnyIterable<V>;

    constructor(target: AnyIterable<V>, callback: (a: V, b: V) => number) {
        super();
        this.callback = callback;
        this.target = target;
    }

    public* [Symbol.iterator]() {
        const data = [...this.target as any];
        yield* data.sort(this.callback);
    }

    public async* [Symbol.asyncIterator]() {
        const data = await this.toArray();
        yield* data.sort(this.callback);
    }
}
