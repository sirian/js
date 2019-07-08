import {Marking, MarkingPlaces} from "../Marking";
import {MarkingStoreInterface} from "../workflow-types";

export class MultipleStateMarkingStore<K extends string> implements MarkingStoreInterface<any> {
    public readonly property: K;

    constructor(property: K) {
        this.property = property;
    }

    public getMarking<S extends string>(subject: Record<K, MarkingPlaces<S>>) {
        return new Marking(subject[this.property]);
    }

    public setMarking<S extends string>(subject: { [P in K]?: MarkingPlaces<S> }, marking: Marking<S>) {
        subject[this.property] = marking.getPlaces();
    }
}
