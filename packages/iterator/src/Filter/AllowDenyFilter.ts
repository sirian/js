import {Filter, IFilter} from "./Filter";
import {SomeFilter} from "./SomeFilter";

export class AllowDenyFilter<V> implements IFilter<V> {
    protected allow: SomeFilter<V>;
    protected deny: SomeFilter<V>;

    constructor(allow: Filter<V> | Array<Filter<V>> = [], deny: Filter<V> | Array<Filter<V>> = []) {
        this.allow = new SomeFilter(allow);
        this.deny = new SomeFilter(deny);
    }

    public test(value: V) {
        if (this.deny.size() && this.deny.test(value)) {
            return false;
        }

        if (this.allow.size()) {
            return this.allow.test(value);
        }

        return true;
    }
}
