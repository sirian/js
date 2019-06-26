import {Obj} from "@sirian/common";
import {Marking} from "../Marking";
import {MarkingStoreInterface} from "../workflow-types";

export class SingleStateMarkingStore<K extends string> implements MarkingStoreInterface<any> {
    public readonly property: K;

    constructor(property: K) {
        this.property = property;
    }

    public getMarking<S extends string>(subject: Record<K, S>): Marking<S>;
    public getMarking(subject: { [P in K]?: string }): Marking<string>;

    public getMarking(subject: any) {
        const placeName = subject[this.property];

        if (!placeName) {
            return new Marking({});
        }

        return new Marking({[placeName]: 1});
    }

    public setMarking<S extends string>(subject: Record<K, S>, marking: Marking<S>) {
        const keys = Obj.keys(marking.getPlaces());
        subject[this.property] = keys[0] as S;
    }
}
