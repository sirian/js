import {stringifyVar} from "@sirian/common";
import {ParameterBagError} from "./ParameterBagError";

export class ParameterCircularReferenceError extends ParameterBagError {
    constructor(keys: string[], previous?: Error) {
        super(`Circular reference detected: "${[...keys, keys[0]].map((element) => stringifyVar(element)).join(" -> ")}"`, previous);
    }
}
