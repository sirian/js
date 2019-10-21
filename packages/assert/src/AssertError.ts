import {CustomError} from "@sirian/error";

export class AssertError extends CustomError {
    public condition: any;
    public data: any[];

    constructor(condition: any, message: string = "Assertion failed", data: any) {
        super(message);
        this.condition = condition;
        this.data = data;
    }
}
