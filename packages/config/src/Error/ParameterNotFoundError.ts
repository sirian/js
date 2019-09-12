import {ParameterBagError} from "./ParameterBagError";

export class ParameterNotFoundError extends ParameterBagError {
    public readonly key: PropertyKey;

    constructor(key: PropertyKey) {
        super();
        this.key = key;
    }
}
