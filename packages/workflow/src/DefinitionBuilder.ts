import {Definition} from "./Definition";
import {Transition} from "./Transition";

export class DefinitionBuilder<S extends string> {
    private places: Set<S> = new Set();
    private transitions: Set<Transition<S>> = new Set();
    private initialPlace?: S;

    constructor(places: S[] = [], transitions: Array<Transition<S>> = []) {
        this.addPlaces(places);
        this.addTransitions(transitions);
    }

    public static create<S extends string>(places: S[] = [], transitions: Array<Transition<S>> = []) {
        return new this(places, transitions);
    }

    public build() {
        return new Definition(this.places, this.transitions, this.initialPlace);
    }

    /**
     * Clear all data in the builder.
     *
     * @return this
     */
    public reset() {
        this.places.clear();
        this.transitions.clear();
        delete this.initialPlace;

        return this;
    }

    public setInitialPlace(place: S) {
        this.initialPlace = place;

        return this;
    }

    public addPlace(place: S) {
        Transition.validateName(place);

        if (!this.places.size) {
            this.initialPlace = place;
        }

        this.places.add(place);

        return this;
    }

    public addPlaces(places: S[]) {
        for (const place of places) {
            this.addPlace(place);
        }

        return this;
    }

    public addTransitions(transitions: Array<Transition<S>>) {
        for (const transition of transitions) {
            this.addTransition(transition);
        }

        return this;
    }

    public addTransition(transition: Transition<S>) {
        this.transitions.add(transition);

        return this;
    }
}
