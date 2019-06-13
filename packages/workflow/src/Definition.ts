import {Transition} from "./Transition";

export class Definition<S extends string> {
    public readonly places: Set<S> = new Set();
    public readonly transitions: Array<Transition<S>> = [];
    public readonly initialPlace?: S;

    constructor(places: Iterable<S>, transitions: Iterable<Transition<S>>, initialPlace?: S) {
        for (const place of places) {
            this.addPlace(place);
            if (!initialPlace) {
                initialPlace = place;
            }
        }

        for (const transition of transitions) {
            this.addTransition(transition);
        }

        if (initialPlace) {
            if (!this.has(initialPlace)) {
                throw new Error(`'Place "${initialPlace}" cannot be the initial place as it does not exist.`);
            }

            this.initialPlace = initialPlace;
        }
    }

    public has(name: S) {
        return this.places.has(name);
    }

    private addPlace(place: S) {
        Transition.validateName(place);

        this.places.add(place);
    }

    private addTransition(transition: Transition<S>) {
        const name = transition.name;

        for (const from of transition.froms) {
            if (!this.has(from)) {
                throw new Error(`Place "${from}" referenced in transition "${name}" does not exist.`);
            }
        }

        for (const to of transition.tos) {
            if (!this.has(to)) {
                throw new Error(`Place "${to}" referenced in transition "${name}" does not exist.`);
            }
        }

        this.transitions.push(transition);
    }
}
