import {Marking} from "./Marking";

export interface MarkingStoreInterface<S extends string> {
    getMarking(subject: object): Marking<S>;

    setMarking(subject: object, marking: Marking<S>, context?: object): void;
}
