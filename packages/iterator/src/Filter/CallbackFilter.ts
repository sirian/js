import {IFilter, IFilterCallback} from "./Filter";

export class CallbackFilter<T> implements IFilter<T> {
    public readonly test: IFilterCallback<T>;

    constructor(test: IFilterCallback<T>) {
        this.test = test;
    }
}
