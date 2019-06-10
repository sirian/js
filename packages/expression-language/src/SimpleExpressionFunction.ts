import {Args, Func} from "@sirian/ts-extra-types";
import {IExpressionFunction} from "./IExpressionFunction";

export class SimpleExpressionFunction<F extends Func> implements IExpressionFunction {
    protected fn: F;

    constructor(fn: F) {
        this.fn = fn;
    }

    public compile(...args: any[]) {
        return [
            "(",
            this.fn,
            ")(",
            args.join(", "),
            ")",
        ].join("");
    }

    public evaluate(...args: Args<F>) {
        return this.fn(...args);
    }
}
