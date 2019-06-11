import {InvalidArgumentError, RuntimeError} from "../Error";
import {Proc} from "../Util";
import {InputDefinition} from "./InputDefinition";
import ReadableStream = NodeJS.ReadableStream;

export abstract class Input {
    protected definition!: InputDefinition;
    protected options: Map<string, any>;
    protected arguments: Map<string, any>;
    protected interactive: boolean;
    protected stream: ReadableStream & { isTTY?: boolean };

    constructor(definition?: InputDefinition, stream: ReadableStream = process.stdin) {
        this.arguments = new Map();
        this.options = new Map();

        this.stream = stream;
        this.interactive = !!this.stream.isTTY;

        if (!definition) {
            this.definition = new InputDefinition();
        } else {
            this.bind(definition);
            this.validate();
        }
    }

    public setStream(stream: ReadableStream) {
        this.stream = stream;
    }

    public bind(definition: InputDefinition) {
        this.options.clear();
        this.arguments.clear();
        this.definition = definition;
        this.parse();
    }

    public abstract getFirstArgument(): string | undefined;

    public abstract hasParameterOption(values: string | string[], onlyParams?: boolean): boolean;

    public abstract getParameterOption(values: string | string[], defaultValue?: any, onlyParams?: boolean): any;

    public validate() {
        const definition = this.definition;
        const givenArguments = this.arguments;
        const givenOptions = this.options;

        const missingArguments = new Set();
        for (const argument of definition.getArguments()) {
            const name = argument.getName();

            if (!givenArguments.has(name) && argument.isRequired()) {
                missingArguments.add(name);
            }
        }

        if (missingArguments.size > 0) {
            throw new RuntimeError(`Not enough arguments (missing: "${[...missingArguments].join(", ")}").`);
        }

        const missingOptions = new Set();
        for (const option of definition.getOptions()) {
            const name = option.getName();
            if (option.isRequired() && !givenOptions.has(name)) {
                missingOptions.add(name);
            }
        }

        if (missingOptions.size > 0) {
            throw new RuntimeError(`Not enough options (missing: "${[...missingOptions].join(", ")}").`);
        }
    }

    public isInteractive() {
        return this.interactive;
    }

    public setInteractive(interactive: boolean) {
        this.interactive = interactive;
    }

    public getArguments() {
        const args = this.definition.getArgumentDefaults();

        for (const [name, argument] of this.arguments) {
            args[name] = argument;
        }

        return args;
    }

    public getArgument(name: string) {
        const definition = this.definition;

        if (!definition.hasArgument(name)) {
            throw new InvalidArgumentError(`The "${name}" argument does not exist.`);
        }

        const args = this.arguments;

        if (args.has(name)) {
            return args.get(name)!;
        }

        return definition.getArgument(name).getDefaultValue();
    }

    public setArgument(name: string, value: any) {
        if (!this.definition.hasArgument(name)) {
            throw new InvalidArgumentError(`The "${name}" argument does not exist.`);
        }

        this.arguments.set(name, value);
    }

    public hasArgument(name: string) {
        return this.definition.hasArgument(name);
    }

    public getOptions() {
        const options = this.definition.getOptionDefaults();

        for (const [key, value] of this.options) {
            options[key] = value;
        }

        return options;
    }

    public getOption(name: string) {
        const definition = this.definition;

        if (!definition.hasOption(name)) {
            throw new InvalidArgumentError(`The "${name}" option does not exist.`);
        }

        const options = this.options;

        if (options.has(name)) {
            return options.get(name)!;
        }

        const option = definition.getOption(name);

        return option.getDefault();
    }

    public setOption(name: string, value: any) {
        if (!this.definition.hasOption(name)) {
            throw new InvalidArgumentError(`The "${name}" option does not exist.`);
        }

        this.options.set(name, value);
    }

    public hasOption(name: string) {
        return this.definition.hasOption(name);
    }

    public escapeToken(token: string) {
        return /^[\w-]+$/.test(token) ? token : Proc.escapeArg(token);
    }

    public getStream() {
        return this.stream;
    }

    protected abstract parse(): void;
}
