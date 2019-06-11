import {BaseIterator} from "./BaseIterator";
import {AnyIterable} from "./Iter";

export interface RecursiveIteratorOptions {
    onlyLeaves: boolean;
    maxDepth: number;
}

export interface RecursiveContext<V> {
    value: V;

    hasChildren: () => boolean | Promise<boolean>;
    getChildren: () => AnyIterable<RecursiveContext<V>>;
}

export class RecursiveIterator<V> extends BaseIterator<V> {
    protected target: AnyIterable<RecursiveContext<V>>;
    protected options: RecursiveIteratorOptions;

    constructor(target: AnyIterable<RecursiveContext<V>>, options: Partial<RecursiveIteratorOptions> = {}) {
        super();
        this.target = target;
        this.options = {
            maxDepth: Number.MAX_SAFE_INTEGER,
            onlyLeaves: true,
            ...options,
        };
    }

    public* [Symbol.iterator](): Iterator<V> {
        for (const x of this.target as any) {
            if (!x.hasChildren()) {
                yield x.value;
                continue;
            }

            if (!this.options.onlyLeaves) {
                yield x.value;
            }

            yield* this.resolveChildren(x);
        }
    }

    public async* [Symbol.asyncIterator](): AsyncIterator<V> {
        for await (const x of this.target) {
            if (!x.hasChildren()) {
                yield x.value;
                continue;
            }
            if (!this.options.onlyLeaves) {
                yield x.value;
            }

            yield* this.resolveChildren(x);
        }
    }

    protected resolveChildren(x: RecursiveContext<V>) {
        const o = this.options;

        if (o.maxDepth > 0) {
            return new RecursiveIterator<V>(x.getChildren(), {
                ...o,
                maxDepth: o.maxDepth - 1,
            });
        }

        return [];
    }
}
