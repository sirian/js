import {isArray, isString} from "@sirian/common";
import {LogicError} from "../Error";
import {IParameterInit, Parameter} from "./Parameter";

export interface IArgumentInit<T> extends IParameterInit<T> {
    required?: boolean;
}

export class Argument<T = any> extends Parameter<T> {
    protected required: boolean;

    constructor(name: string, init?: IArgumentInit<T>);
    constructor(init?: IArgumentInit<T>);

    constructor(...args: any[]) {
        const options: IArgumentInit<T> =
            isString(args[0])
            ? {name: args[0], ...args[1]}
            : {...args[0]};

        super(options);

        this.required = !!options.required;
    }

    public isRequired() {
        return this.required;
    }

    public getSynopsis() {
        const name = this.getName();

        const synopsis = [];
        synopsis.push("<" + name + ">");

        if (this.isMultiple()) {
            synopsis.push("...");
        }

        if (!this.isRequired()) {
            synopsis.push("[" + synopsis + "]");
        }

        return synopsis.join("");
    }

    protected normalizeDefaultValue(defaultValue: any) {
        if (this.isRequired() && undefined !== defaultValue) {
            throw new LogicError("Cannot set a default value for required argument");
        }

        if (this.isMultiple()) {
            if (undefined === defaultValue) {
                return [];
            }

            if (!isArray(defaultValue)) {
                throw new LogicError("A default value for an multiple argument must be an array.");
            }
        }

        return defaultValue;
    }
}
