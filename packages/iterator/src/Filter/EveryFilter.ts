import {MultiFilter} from "./MultiFilter";

export class EveryFilter<V> extends MultiFilter<V> {
    public test(value: V) {
        return this.filters.every((filter) => filter.test(value));
    }
}
