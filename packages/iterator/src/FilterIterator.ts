import {Var} from "@sirian/common";
import {BaseIterator} from "./BaseIterator";
import {Filter, IFilterCallback} from "./Filter";
import {AnyIterable} from "./Iter";

export class FilterIterator<V> extends BaseIterator<V> {
    protected callback: IFilterCallback<V>;
    protected target: AnyIterable<V>;

    constructor(target: AnyIterable<V>, filter: Filter<V>) {
        super();
        this.callback = Var.isFunction(filter) ? filter : filter.test.bind(filter);
        this.target = target;
    }

    public*[Symbol.iterator]() {
        for (const x of this.target as any) {
            if (this.callback(x)) {
                yield x;
            }
        }
    }

    public async*[Symbol.asyncIterator]() {
        for await (const x of this.target) {
            if (await this.callback(x)) {
                yield x;
            }
        }
    }
}