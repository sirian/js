import {ParameterBagError} from "./ParameterBagError";

export class ParameterCircularReferenceError extends ParameterBagError {
    constructor(parameters: string[], previous?: Error) {
        super(`Circular reference detected: "${parameters.map((v) => JSON.stringify(v)).join(" -> ")}"`, previous);
    }
}
