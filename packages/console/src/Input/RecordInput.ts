import {castArray, entriesOf, isNullish, isNumber} from "@sirian/common";
import {InvalidArgumentError, InvalidOptionError} from "../Error";
import {Input} from "./Input";
import {InputDefinition} from "./InputDefinition";

export class RecordInput extends Input {
    protected parameters: Map<string, string>;

    constructor(parameters: Record<string, string> = {}, definition?: InputDefinition) {
        super(definition);

        this.parameters = new Map(entriesOf(parameters));
    }

    public getFirstArgument() {
        for (const [key, value] of this.parameters) {
            if (key && "-" === key[0]) {
                continue;
            }

            return value;
        }
    }

    public hasParameterOption(values: string | string[], onlyParams: boolean = false): boolean {
        values = castArray(values);

        for (let [k, v] of this.parameters) {
            if (!isNumber(k)) {
                v = k;
            }

            if (onlyParams && "--" === v) {
                return false;
            }

            if (values.includes(v)) {
                return true;
            }
        }

        return false;
    }

    public getParameterOption(values: string | string[], defaultValue = false, onlyParams: boolean = false) {
        values = castArray(values);

        for (const [k, v] of this.parameters) {
            if (onlyParams && (k === "--" || (isNumber(k) && "--" === v))) {
                return false;
            }

            if (isNumber(k)) {
                if (values.includes(v)) {
                    return true;
                }
            } else if (values.includes(k)) {
                return v;
            }
        }

        return defaultValue;
    }

    public toString() {
        const params: string[] = [];

        for (const [param, val] of this.parameters) {
            if (param && "-" === param[0]) {
                for (const v of castArray(val)) {
                    if (v) {
                        params.push(param + "=" + this.escapeToken(v));
                    } else {
                        params.push(param);
                    }
                }
            } else {
                const value = castArray(val)
                    .map((v) => this.escapeToken(v))
                    .join(" ");

                params.push(value);
            }
        }

        return params.join(" ");
    }

    protected parse() {
        for (const [key, value] of this.parameters) {
            if ("--" === key) {
                return;
            }
            if (key.startsWith("--")) {
                this.addLongOption(key.substr(2), value);
            } else if (key.startsWith("-")) {
                this.addShortOption(key.substr(1), value);
            } else {
                this.addArgument(key, value);
            }
        }
    }

    private addShortOption(shortcut: string, value: any) {
        const definition = this.definition;
        if (!definition.hasShortcut(shortcut)) {
            throw new InvalidOptionError(`The "-${shortcut}" option does not exist.`);
        }
        this.addLongOption(definition.getOptionForShortcut(shortcut).getName(), value);
    }

    private addLongOption(name: string, value: any) {
        const definition = this.definition;

        if (!definition.hasOption(name)) {
            throw new InvalidOptionError(`The "--${name}" option does not exist.`);
        }

        const option = definition.getOption(name);

        if (isNullish(value)) {
            if (option.isValueRequired()) {
                throw new InvalidOptionError(`The "--${name}" option requires a value.`);
            }

            if (option.isValueRequired()) {
                value = true;
            }
        }

        this.options.set(name, value);
    }

    private addArgument(name: string, value: any) {
        if (!this.definition.hasArgument(name)) {
            throw new InvalidArgumentError(`The "${name}" argument does not exist.`);
        }

        this.arguments.set(name, value);
    }
}
