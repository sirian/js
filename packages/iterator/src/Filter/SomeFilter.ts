import {MultiFilter} from "./MultiFilter";

export class SomeFilter<V> extends MultiFilter<V> {
    public test(value: V) {
        return this.filters.some((filter) => filter.test(value));
    }
}
