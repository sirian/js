import {hasOwn, Obj} from "@sirian/common";

export type MarkingPlaces<S extends string = any> = Partial<Record<S, number>>;

export class Marking<S extends string = any> {
    protected readonly places: Partial<Record<S, any>>;

    constructor(representation: Partial<MarkingPlaces<S>> = {}) {
        this.places = {};
        if (representation) {
            for (const place of Obj.keys(representation)) {
                this.mark(place as S);
            }
        }
    }

    public mark(place: S) {
        this.places[place] = 1;
    }

    public unmark(place: S) {
        delete this.places[place];
    }

    public has(place: S) {
        return hasOwn(this.places, place);
    }

    public getPlaces() {
        return this.places;
    }

    public isEmpty() {
        return Obj.isEmpty(this.places);
    }
}
