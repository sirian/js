import {isArray, isInstanceOf, isNumber, Ref} from "@sirian/common";
import {InvalidArgumentError, LogicError} from "../Error";
import {KV} from "../Util";
import {Argument} from "./Argument";
import {Option} from "./Option";

export interface InputDefinitionInit {
    options: Record<string, Option> | Option[];
    arguments: Record<string, Argument> | Argument[];
}

export class InputDefinition {
    protected arguments: Map<string, Argument>;
    protected options: Map<string, Option>;
    protected shortcuts: Map<string, Option>;

    constructor(definition: Array<Argument | Option> | Partial<InputDefinitionInit> = {}) {
        this.arguments = new Map();
        this.options = new Map();
        this.shortcuts = new Map();

        if (isArray(definition)) {
            const args = definition.filter((a) => isInstanceOf(a, Argument));
            this.setArguments(args as Argument[]);

            const options = definition.filter((o) => isInstanceOf(o, Option));
            this.setOptions(options as Option[]);
        } else {
            this.setArguments(definition.arguments || {});
            this.setOptions(definition.options || {});
        }
    }

    public setArguments(args: Record<string, Argument> | Argument[]) {
        this.arguments.clear();
        return this.addArguments(args);
    }

    public addArguments(args: Record<string, Argument> | Argument[]) {
        if (isArray(args)) {
            for (const argument of args) {
                this.addArgument(argument.getName(), argument);
            }
        } else {
            for (const [name, argument] of KV.entries(args)) {
                this.addArgument(name, argument);
            }
        }

        return this;
    }

    public addArgument(name: string, argument: Argument) {
        argument.setName(name);

        if (this.arguments.has(name)) {
            throw new LogicError(`An argument with name "${name}" already exists.`);
        }

        if (this.hasMultipleArgument()) {
            throw new LogicError("Cannot add an argument after an array argument.");
        }

        if (argument.isRequired() && this.hasOptionalArgument()) {
            throw new LogicError("Cannot add a required argument after an optional one.");
        }

        this.arguments.set(name, argument);
        return this;
    }

    public getArguments(): Argument[] {
        return [...this.arguments.values()];
    }

    public getArgument(name: string | number) {
        if (!this.hasArgument(name)) {
            throw new InvalidArgumentError(`The "${name}" argument does not exist.`);
        }

        if (isNumber(name)) {
            return this.getArgumentByIndex(name)!;
        }

        return this.arguments.get(name)!;
    }

    public hasArgument(name: string | number) {
        if (isNumber(name)) {
            const args = this.getArguments();
            return Ref.hasOwn(args, name);
        }

        return this.arguments.has(name);
    }

    public getArgumentByIndex(index: number) {
        const args = this.getArguments();
        return args[index];
    }

    public hasMultipleArgument() {
        return this.getArguments().some((arg) => arg.isMultiple());
    }

    public hasOptionalArgument() {
        return this.arguments.size > this.getArgumentRequiredCount();
    }

    public getArgumentRequiredCount() {
        return this.getArguments().filter((arg) => arg.isRequired()).length;
    }

    public getArgumentDefaults() {
        const values: Record<string, any> = {};

        for (const [name, argument] of this.arguments) {
            values[name] = argument.getDefaultValue();
        }

        return values;
    }

    public getOptions() {
        return [...this.options.values()];
    }

    public setOptions(options: Record<string, Option> | Option[]) {
        this.options.clear();
        this.shortcuts.clear();
        this.addOptions(options);
        return this;
    }

    public addOptions(options: Record<string, Option> | Option[]) {
        if (isArray(options)) {
            for (const option of options) {
                this.addOption(option.getName(), option);
            }
        } else {
            for (const [name, option] of KV.entries(options)) {
                this.addOption(name, option);
            }
        }
        return this;
    }

    public addOption<T>(name: string, option: Option<T>) {
        option.setName(name);

        const options = this.options;

        if (options.has(name)) {
            throw new LogicError(`An option named "${name}" already exists.`);
        }

        const shortcuts = this.shortcuts;

        for (const shortcut of option.getShortcuts()) {
            if (shortcuts.has(shortcut) && shortcuts.get(shortcut)! !== option) {
                throw new LogicError(`An option with shortcut "-${shortcut}" already exists.`);
            }
        }

        options.set(name, option);

        for (const shortcut of option.getShortcuts()) {
            shortcuts.set(shortcut, option);
        }
    }

    public getOption(name: string) {
        if (!this.hasOption(name)) {
            throw new InvalidArgumentError(`The "--${name}" option does not exist.`);
        }

        return this.options.get(name)!;
    }

    public hasOption(name: string) {
        return this.options.has(name);
    }

    public hasShortcut(name: string) {
        return this.shortcuts.has(name);
    }

    public getOptionForShortcut(shortcut: string) {
        if (!this.hasShortcut(shortcut)) {
            throw new InvalidArgumentError(`The "-${shortcut}" option does not exist.`);
        }

        return this.shortcuts.get(shortcut)!;
    }

    public getOptionDefaults() {
        const values: Record<string, any> = {};

        for (const [name, option] of this.options) {
            values[name] = option.getDefault();
        }

        return values;
    }

    public getSynopsis(short: boolean = false) {
        const elements: string[] = [];

        const opts = this.options;

        if (short) {
            if (opts.size) {
                elements.push("[options]");
            }
        } else {
            for (const option of opts.values()) {
                elements.push("[" + option.getSynopsis() + "]");
            }
        }

        const args = this.arguments;
        if (elements.length && args.size) {
            elements.push("[--]");
        }

        for (const argument of args.values()) {
            elements.push(argument.getSynopsis());
        }

        return elements.join(" ");
    }
}
