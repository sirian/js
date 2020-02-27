import {CustomError} from "@sirian/error";

export class PropertyNotExistError extends CustomError {
    public readonly target: any;
    public readonly key: PropertyKey;

    constructor(target: any, key: PropertyKey) {
        super(`Property "${String(key)}" doesn't exist on "${target}"`);
        this.target = target;
        this.key = key;
    }
}
