import {CustomError} from "./CustomError";

export class AggregateError<T = any> extends CustomError {
    public readonly errors: T[];

    constructor(errors: Iterable<T> = [], message: string = "") {
        super(message);

        this.errors = Array.from(errors);
    }

    public* [Symbol.iterator]() {
        return yield* this.errors;
    }
}
