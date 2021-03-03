import {PathElement, propertyPathToString} from "../PropertyPath";
import {PropertyAccessError} from "./PropertyAccessError";

export class UnexpectedTypeError extends PropertyAccessError {
    constructor(value: any, path: PathElement[], pathIndex: number) {
        const message =
            "Property requires a graph of objects or arrays to operate on, " +
            `but it found type "${typeof value}" while trying to traverse path "${propertyPathToString(path)}"` +
            `at property "${path[pathIndex][0]}".`;

        super(message);
    }
}
