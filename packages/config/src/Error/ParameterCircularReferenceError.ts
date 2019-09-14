import {ParameterBagError} from "./ParameterBagError";

export class ParameterCircularReferenceError extends ParameterBagError {
    constructor(keys: string[], previous?: Error) {
        super(`Circular reference detected: "${[...keys, keys[0]].map(String).join(" -> ")}"`, previous);
    }
}
