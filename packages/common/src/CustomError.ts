import {stringifyVar} from "./stringify";

export class CustomError extends Error {
    public previous?: Error;
    public extra: any;

    constructor(message?: any, previous?: Error, extra?: any) {
        super(stringifyVar(message));
        this.previous = previous;
        this.extra = extra;
        (Error as any).captureStackTrace?.(this, new.target);
        this.name = new.target.name;
    }
}
