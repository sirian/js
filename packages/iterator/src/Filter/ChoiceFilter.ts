import {IFilter} from "./Filter";

export class ChoiceFilter<V> implements IFilter<V> {
    protected choices: V[];

    constructor(choices: V[]) {
        this.choices = choices;
    }

    public test(value: V) {
        return -1 !== this.choices.indexOf(value);
    }
}
