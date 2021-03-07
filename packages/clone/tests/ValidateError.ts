import {CustomError} from "@sirian/common";

export class ValidateError extends CustomError {
    public readonly path: PropertyKey[];
    public readonly error: Error;

    constructor(src: any, clone: any, path: PropertyKey[], error: Error) {

        super(`Validate error at path [${path.join("][")}]: ${error.message}`);
        this.path = path;
        this.error = error;
    }
}
