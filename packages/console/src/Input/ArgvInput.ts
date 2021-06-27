import {castArray} from "@sirian/common";
import {RuntimeError} from "../Error";
import {Input} from "./Input";
import {InputDefinition} from "./InputDefinition";

export class ArgvInput extends Input {
    public readonly tokens: string[];
    protected parsed!: string[];

    constructor(argv?: string[], definition?: InputDefinition) {
        super();

        argv = argv || process.argv.slice(1);

        // strip the application name
        argv = argv.slice(1);

        this.tokens = [];
        this.setTokens(argv);

        if (definition) {
            this.bind(definition);
            this.validate();
        }
    }

    public getFirstArgument() {
        for (const token of this.tokens) {
            if (token && token.startsWith("-")) {
                continue;
            }

            return token;
        }
        return undefined;
    }

    public hasParameterOption(values: string | string[], onlyParams = false) {
        values = castArray(values);

        for (const token of this.tokens) {
            if (onlyParams && "--" === token) {
                return false;
            }

            for (const value of values) {
                // Options with values:
                //   For long options, test for '--option=' at beginning
                //   For short options, test for '-o' at beginning
                const leading = value.startsWith("--") ? value + "=" : value;

                if (token === value || ("" !== leading && token.startsWith(leading))) {
                    return true;
                }
            }
        }

        return false;
    }

    public getParameterOption(values: string | string[], defaultValue = false, onlyParams = false) {
        values = castArray(values);

        const tokens = [...this.tokens];

        while (tokens.length) {
            const token = tokens.shift()!;

            if (onlyParams && "--" === token) {
                return false;
            }

            for (const value of values) {
                if (token === value) {
                    return tokens.shift();
                }

                // Options with values:
                //   For long options, test for '--option=' at beginning
                //   For short options, test for '-o' at beginning
                const leading = value.startsWith("--") ? value + "=" : value;
                if ("" !== leading && token.startsWith(leading)) {
                    return token.substr(leading.length);
                }
            }
        }

        return defaultValue;
    }

    public toString() {
        const tokens = this.tokens.map((token) => {
            const match = /^(-[^=]+=)(.+)/.exec(token);
            if (match) {
                return match[1] + this.escapeToken(match[2]);
            }

            if (token && "-" !== token[0]) {
                return this.escapeToken(token);
            }

            return token;
        });

        return tokens.join(" ");
    }

    protected setTokens(tokens: string[]) {
        this.tokens.length = 0;
        this.tokens.push(...tokens);
    }

    protected parse() {
        let parseOptions = true;

        this.parsed = [...this.tokens];

        while (this.parsed.length) {
            const token = this.parsed.shift()!;

            if (parseOptions && "" === token) {
                this.parseArgument(token);
            } else if (parseOptions && "--" === token) {
                parseOptions = false;
            } else if (parseOptions && token.startsWith("--")) {
                this.parseLongOption(token);
            } else if (parseOptions && token.startsWith("-") && "-" !== token) {
                this.parseShortOption(token);
            } else {
                this.parseArgument(token);
            }
        }
    }

    private parseShortOption(token: string) {
        const name = token.substr(1);

        if (name.length > 1) {
            const shortcut = name[0];
            const definition = this.definition;
            if (definition.hasShortcut(shortcut) && definition.getOptionForShortcut(shortcut).acceptValue()) {
                // an option with a value (with no space)
                this.addShortOption(shortcut, name.substr(1));
            } else {
                this.parseShortOptionSet(name);
            }
        } else {
            this.addShortOption(name, undefined);
        }
    }

    private parseShortOptionSet(name: string) {
        const len = name.length;

        const definition = this.definition;

        for (let i = 0; i < len; ++i) {
            const char = name[i];
            if (!definition.hasShortcut(char)) {
                throw new RuntimeError(`The "-${char}" option does not exist.`);
            }

            const option = definition.getOptionForShortcut(char);

            if (option.acceptValue()) {
                this.addLongOption(option.getName(), i === len - 1 ? undefined : name.substr(i + 1));
                break;
            } else {
                this.addLongOption(option.getName(), undefined);
            }
        }
    }

    private parseLongOption(token: string) {
        const name = token.substr(2);
        const pos = name.indexOf("=");
        if (-1 !== pos) {
            const value = name.substr(pos + 1);

            this.addLongOption(name.substr(0, pos), value);
        } else {
            this.addLongOption(name, undefined);
        }
    }

    private parseArgument(token: string) {
        const args = this.arguments;

        const c = args.size;

        // if input is expecting another argument, add it
        const definition = this.definition;

        if (definition.hasArgument(c)) {
            const arg = definition.getArgument(c);

            args.set(arg.getName(), arg.isMultiple() ? [token] : token);

            // if last argument isArray(), append token to last argument
        } else if (definition.hasArgument(c - 1) && definition.getArgument(c - 1)!.isMultiple()) {
            const arg = definition.getArgument(c - 1);
            args.get(arg.getName())!.push(token);

            // unexpected argument
        } else {
            const expected = definition.getArguments();
            if (expected.length) {
                throw new RuntimeError(
                    `Too many arguments, expected arguments "${expected.map((arg) => arg.getName()).join("\" \"")}".`,
                );
            }

            throw new RuntimeError(`No arguments expected, got "${token}".`);
        }
    }

    private addShortOption(shortcut: string, value: any) {
        const definition = this.definition;
        if (!definition.hasShortcut(shortcut)) {
            throw new RuntimeError(`The "-${shortcut}" option does not exist.`);
        }

        this.addLongOption(definition.getOptionForShortcut(shortcut).getName(), value);
    }

    private addLongOption(name: string, value: string | undefined) {
        const definition = this.definition;

        if (!definition.hasOption(name)) {
            throw new RuntimeError(`The "--${name}" option does not exist.`);
        }

        const option = definition.getOption(name)!;

        if (!option.acceptValue() && undefined !== value) {
            throw new RuntimeError(`The "--${name}" option does not accept a value.`);
        }

        const parsed = this.parsed;

        if (undefined === value && option.acceptValue() && parsed.length) {
            // if option accepts an optional or mandatory argument
            // let's see if there is one provided
            const next = parsed.shift();
            if ("" === next || undefined === next || (next.length && !next.startsWith("-"))) {
                value = next;
            } else {
                parsed.unshift(next);
            }
        }

        if (undefined === value) {
            if (option.isValueRequired()) {
                throw new RuntimeError(`The "--${name}" option requires a value.`);
            }
            value = option.getDefaultValue();
        } else {
            value = option.normalize(value);
        }

        option.validate(value);

        const options = this.options;

        if (option.isMultiple()) {
            if (!options.has(name)) {
                options.set(name, []);
            }
            options.get(name)!.push(value);
        } else {
            options.set(name, value);
        }
    }
}
