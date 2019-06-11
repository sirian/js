import {Arr, Var} from "@sirian/common";
import {CallbackFilter} from "./CallbackFilter";
import {Filter, IFilter} from "./Filter";

export abstract class MultiFilter<V> implements IFilter<V> {
    protected filters: Array<IFilter<V>>;

    constructor(filters: Filter<V> | Array<Filter<V>> = []) {
        this.filters = [];
        this.add(filters);
    }

    public size() {
        return this.filters.length;
    }

    public add(filters: Filter<V> | Array<Filter<V>>) {
        for (const filter of Arr.cast(filters)) {
            const f = Var.isFunction(filter) ? new CallbackFilter(filter) : filter;
            this.filters.push(f);
        }
    }

    public abstract test(value: V): boolean;
}
