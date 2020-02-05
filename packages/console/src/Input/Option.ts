import {isArray, isNullish, isString, Var} from "@sirian/common";
import {InvalidArgumentError, LogicError} from "../Error";
import {IParameterInit, Parameter} from "./Parameter";

export interface IOptionInit<T> extends IParameterInit<T> {
    shortcut?: string | string[];
    valueRequired?: boolean;
    required?: boolean;
    default?: T;
}

export class Option<T = any> extends Parameter<T> {
    protected shortcuts: string[];
    protected valueRequired: boolean;
    protected required: boolean;
    protected default?: T;

    constructor(name: string, shortcut: string, init?: IOptionInit<T>);
    constructor(name: string, init?: IOptionInit<T>);
    constructor(init?: IOptionInit<T>);

    constructor(...args: any[]) {
        const init = Option.resolveArgs<T>(args);

        super(init);

        this.name = Var.stringify(this.name).replace(/^-+/, "");
        this.shortcuts = Option.parseShortcuts(init.shortcut);
        this.required = Boolean(init.required);
        this.valueRequired = Boolean(init.valueRequired) || this.required;
        this.default = init.default;
    }

    public static resolveArgs<T>(args: any): IOptionInit<T> {
        const [a1, a2, a3] = args;
        if (isString(a1)) {
            if (isString(a2)) {
                return {name: a1, shortcut: a2, ...a3};
            } else {
                return {name: a1, ...a2};
            }
        }
        return {...a1};
    }

    public static parseShortcuts(shortcut?: string | string[]) {
        if (isNullish(shortcut)) {
            return [];
        }

        const shortcuts = isArray(shortcut) ? shortcut : shortcut.split("|");

        const result = new Set<string>();

        for (const str of shortcuts) {
            result.add(str.replace(/^-+/, ""));
        }

        if (!result.size) {
            throw new InvalidArgumentError("An option shortcut cannot be empty.");
        }

        return [...result];
    }

    public isRequired() {
        return this.required;
    }

    public getDefault() {
        return this.default;
    }

    public getShortcuts() {
        return this.shortcuts;
    }

    public getSynopsis() {
        const shortcuts = this.getShortcuts();

        const name = this.getName();
        const aliases = shortcuts.map((shortcut) => `-${shortcut}`);

        const names = [
            aliases.join("|"),
            `--${name}`,
        ].filter(Boolean).join(", ");

        let value = "";
        if (this.acceptValue()) {
            value = "=" + this.getValueSynopsis();

            if (!this.isValueRequired()) {
                value = `[${value}]`;
            }
        }

        return `${names}${value}`;
    }

    public acceptValue() {
        return true;
    }

    public isValueRequired() {
        return this.valueRequired;
    }

    public getValueSynopsis() {
        return this.getName().toUpperCase();
    }

    protected normalizeDefaultValue(defaultValue: any) {
        if (this.isValueRequired() && undefined !== defaultValue) {
            throw new LogicError("Cannot set a default value for required option");
        }

        if (this.isMultiple()) {
            if (undefined === defaultValue) {
                return [];
            }

            if (!isArray(defaultValue)) {
                throw new LogicError("A default value for an multiple option must be an array.");
            }
        }

        return defaultValue;
    }
}
