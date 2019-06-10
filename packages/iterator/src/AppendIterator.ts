import {BaseIterator} from "./BaseIterator";
import {AnyIterable} from "./Iter";

export class AppendIterator<V> extends BaseIterator<V> {
    protected sources: Array<AnyIterable<V>>;

    constructor(sources: Array<AnyIterable<V>> = []) {
        super();
        this.sources = [...sources];
    }

    public add(iterator: AnyIterable<V>) {
        this.sources.push(iterator);
    }

    public*[Symbol.iterator]() {
        for (const source of this.sources) {
            yield*source as any;
        }
    }

    public async*[Symbol.asyncIterator]() {
        for (const source of this.sources) {
            yield*source;
        }
    }
}
