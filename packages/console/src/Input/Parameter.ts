import {stringifyVar} from "@sirian/common";
import {InvalidArgumentError, ValueValidateError} from "../Error";

export type ValueNormalizer<T> = (value: string) => T;
export type ValueValidator<T> = (value: T) => boolean;

export interface IParameterInit<T> {
    name?: string;
    description?: string;
    defaultValue?: T;
    normalizer?: ValueNormalizer<T>;
    validator?: ValueValidator<T>;
    multiple?: boolean;
    allowedValues?: T[];
}

export abstract class Parameter<T> {
    protected description: string;
    protected name?: string;
    protected defaultValue?: T;
    protected normalizer?: ValueNormalizer<T>;
    protected validator?: ValueValidator<T>;
    protected multiple: boolean;
    protected allowedValues: T[];

    constructor(init: IParameterInit<T>) {
        this.name = stringifyVar(init.name);
        this.description = stringifyVar(init.description);
        this.defaultValue = init.defaultValue;
        this.normalizer = init.normalizer;
        this.validator = init.validator;
        this.multiple = !!init.multiple;
        this.allowedValues = init.allowedValues || [];
    }

    public normalize(value: string) {
        if (!this.normalizer) {
            return value;
        }

        return this.normalizer(value);
    }

    public getAllowedValues() {
        return this.allowedValues;
    }

    public validate(value: T): void {
        const validator = this.validator;

        if (validator) {
            const isValid = validator(value);

            if (!isValid) {
                throw new ValueValidateError(
                    `Value "${value}" is not allowed for ${this.constructor.name} ${this.getName()}`,
                );
            }
        } else {
            const allowedValues = this.allowedValues;

            if (allowedValues.length && !allowedValues.includes(value)) {
                throw new ValueValidateError(
                    `Value "${value}" is not allowed for ${
                        this.constructor.name
                    } ${this.getName()}. Allowed: ${allowedValues.join(", ")}`,
                );
            }
        }
    }

    public getDescription() {
        return this.description;
    }

    public getDefaultValue() {
        return this.defaultValue;
    }

    public getName() {
        if (!this.hasName()) {
            throw new InvalidArgumentError(`An ${this.constructor.name} name cannot be empty.`);
        }
        return this.name;
    }

    public hasName(): this is this & { name: string } {
        return !!this.name;
    }

    public setName(name: string) {
        this.name = stringifyVar(name);
        return this;
    }

    public isMultiple() {
        return this.multiple;
    }

    public abstract getSynopsis(): string;

    protected abstract normalizeDefaultValue(defaultValue: any): T;
}
