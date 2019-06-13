import {PropertyPath} from "../PropertyPath";
import {PropertyAccessError} from "./PropertyAccessError";

export class UnexpectedTypeError extends PropertyAccessError {
    constructor(value: any, path: PropertyPath, pathIndex: number) {
        const message =
            "Property requires a graph of objects or arrays to operate on, " +
            `but it found type "${typeof value}" while trying to traverse path "${path}"` +
            `at property "${path.getPart(pathIndex)}".`;

        super(message);
    }
}
