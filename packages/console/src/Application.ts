import {castError, entriesOf, padRight, rgxEscape, sprintf, stringifyVar, substrCount, XSet} from "@sirian/common";
import {Dispatcher, EventDispatcher} from "@sirian/event-dispatcher";
import {CommandDefinition, HelpCommand, ICommandConstructor, ICommandLoader, ListCommand} from "./Command";
import {CommandNotFoundError, LogicError, NamespaceNotFoundError} from "./Error";
import {ErrorEvent} from "./Event";
import {Argument, FlagOption, Input, InputDefinition, RecordInput} from "./Input";
import {IO} from "./IO";
import {OutputVerbosity} from "./Output";
import {StrUtil} from "./Util";

export interface IApplicationInit {
    name?: string;
    version?: string;
    defaultCommandName?: string;
    commands?: ICommandConstructor[];
    commandLoader?: ICommandLoader;
}

export class Application {
    public readonly onError: Dispatcher;
    protected name: string;
    protected version: string;
    protected inputDefinition: InputDefinition;
    protected commands: Map<string, ICommandConstructor>;
    protected commandLoader?: ICommandLoader;
    protected defaultCommandName: string;

    constructor(init: IApplicationInit = {}) {
        this.name = init.name || "Application";
        this.version = init.version || "1.0.0";
        this.defaultCommandName = init.defaultCommandName || "list";
        this.commandLoader = init.commandLoader;

        this.commands = new Map();

        this.onError = new EventDispatcher();

        this.inputDefinition = new InputDefinition({
            arguments: [
                new Argument("command", {required: true, description: "The command to execute"}),
            ],
            options: [
                new FlagOption("--help", {description: "Display this help message"}),
                new FlagOption("--quiet", {description: "Do not output any message"}),
                new FlagOption("--version", {description: "Display this application version"}),
                new FlagOption("--verbose", "-v|vv|vvv", {description: "Increase the verbosity of messages"}),
                new FlagOption("--ansi", {description: "Force ANSI output"}),
                new FlagOption("--no-ansi", {description: "Disable ANSI output"}),
                new FlagOption("--no-interactive", {description: "Do not ask any interactive question"}),
            ],
        });

        this
            .addCommands([HelpCommand, ListCommand])
            .addCommands(init.commands || []);
    }

    public async run(io?: IO) {
        io = io || new IO();

        this.configureIO(io);

        try {
            return await this.doRun(io);
        } catch (e) {
            const eventDispatcher = this.onError;

            if (eventDispatcher.hasListeners()) {
                await eventDispatcher.dispatch(new ErrorEvent(e));
            } else {
                io.renderError(castError(e));
            }
        }
    }

    public async doRun(io: IO) {
        const input = io.input;

        if (input.hasParameterOption(["--version"], true)) {
            io.output.writeln(this.getLongVersion());
            return 0;
        }

        const commandFactory = await this.findCommand(io);

        const command = commandFactory.create(this, io);

        await command.run();
    }

    public setInputDefinition(definition: InputDefinition) {
        this.inputDefinition = definition;
    }

    public getInputDefinition() {
        return this.inputDefinition;
    }

    public getHelp() {
        return this.getLongVersion();
    }

    public getName() {
        return this.name;
    }

    public setName(name: string) {
        this.name = stringifyVar(name);
        return this;
    }

    public getVersion() {
        return this.version;
    }

    public setVersion(version: string) {
        this.version = version;
    }

    public getLongVersion() {
        return sprintf(`%s <info>%s</info>`, this.getName(), this.getVersion());
    }

    public addCommands(commands: Iterable<ICommandConstructor>) {
        for (const command of commands) {
            this.add(command);
        }
        return this;
    }

    public add(factory: ICommandConstructor): CommandDefinition {
        const definition = factory.getDefinition();

        const name = definition.getName();

        if (!name) {
            throw new LogicError("The command cannot have an empty name.");
        }

        const commands = this.commands;

        commands.set(name, factory);

        for (const alias of definition.getAliases()) {
            commands.set(alias, factory);
        }

        return definition;
    }

    public async getCommand(name: string) {
        if (this.commands.has(name)) {
            return this.commands.get(name)!;
        }

        if (this.commandLoader?.has(name)) {
            const cmd = await this.commandLoader.get(name)!;
            this.add(cmd);
            return cmd;
        }
        throw new CommandNotFoundError(`The command "${name}" does not exist.`);
    }

    public hasCommand(name: string) {
        if (this.commands.has(name)) {
            return true;
        }
        if (this.commandLoader && this.commandLoader.has(name)) {
            return true;
        }
        return false;
    }

    public getNamespaces(): string[] {
        const result = new XSet<string>();

        for (const name of this.getNames()) {
            const namespaces = this.extractAllNamespaces(name);
            result.add(...namespaces);
        }

        return result.toArray();
    }

    public findNamespace(namespace: string) {
        const allNamespaces = this.getNamespaces();
        const expr = namespace.replace(/([^:]+|)/, (text) => rgxEscape(text) + "[^:]*");
        const re = new RegExp("^" + expr);
        const namespaces = allNamespaces.filter((n) => re.test(n));

        if (!namespaces.length) {
            const messages = [`There are no commands defined in the "${namespace}" namespace.`];

            const alternatives = this.findAlternatives(namespace, allNamespaces);

            if (alternatives.length) {
                if (1 === alternatives.length) {
                    messages.push("\n\nDid you mean this?\n    ");
                } else {
                    messages.push("\n\nDid you mean one of these?\n    ");
                }

                messages.push(alternatives.join("\n    "));
            }

            throw new NamespaceNotFoundError(messages.join(""), alternatives);
        }

        const exact = namespaces.includes(namespace);

        if (namespaces.length > 1 && !exact) {
            const msg = [
                `The namespace "${namespace}" is ambiguous.`,
                `Did you mean one of these?`,
                this.getAbbreviationSuggestions(namespaces),
            ];
            throw new NamespaceNotFoundError(msg.join("\n"), namespaces);
        }

        return exact ? namespace : namespaces[0];
    }

    public async find(name: string) {
        const commands = this.commands;
        const commandNames = [...commands.keys()];
        if (this.commandLoader) {
            commandNames.push(...this.commandLoader.getNames());
        }

        const expr = name.replace(/([^:]+|)/, (text) => rgxEscape(text) + "[^:]*");

        const re = new RegExp("^" + expr);
        const rei = new RegExp("^" + expr, "i");
        let found = commandNames.filter((c) => re.test(c));

        if (!found.length) {
            found.push(...commandNames.filter((c) => rei.test(c)));
        }

        // if no found matched or we just matched namespaces
        if (!found.length || !found.filter((c) => rei.test(c)).length) {
            if (name.includes(":")) {
                // check if a namespace exists and contains found
                const pos = name.indexOf(":");
                this.findNamespace(name.slice(0, Math.max(0, pos)));
            }

            let message = `Command "${name}" is not defined.`;

            const alternatives = this.findAlternatives(name, commandNames);
            if (alternatives.length) {
                message += 1 === alternatives.length
                           ? "\n\nDid you mean this?\n    "
                           : "\n\nDid you mean one of these?\n    ";
                message += alternatives.join("\n    ");
            }

            throw new CommandNotFoundError(message, alternatives);
        }

        const aliases = new Map();

        // filter out aliases for found which are already on the list
        if (found.length > 1) {
            const filteredCommands = new Set<string>();

            for (const nameOrAlias of found) {
                let commandName = nameOrAlias;

                if (commands.has(nameOrAlias)) {
                    const command = commands.get(nameOrAlias)!;
                    commandName = command.getDefinition().getName();
                }

                aliases.set(nameOrAlias, commandName);

                if (commandName === nameOrAlias || !found.includes(commandName)) {
                    filteredCommands.add(nameOrAlias);
                }
            }

            found = [...filteredCommands];
        }

        const exact = found.includes(name) || aliases.has(name);

        if (found.length > 1 && !exact) {
            const widths = found.map((abbr) => StrUtil.width(abbr));
            const maxLen = Math.max(...widths);

            const abbrevs = [];
            for (const cmdName of found) {
                const command = await this.getCommand(cmdName);

                const description = command.getDefinition().getDescription();
                const abbr = padRight(cmdName, maxLen) + " " + description;
                abbrevs.push(abbr);
            }

            const suggestions = this.getAbbreviationSuggestions(abbrevs);

            throw new CommandNotFoundError(
                `Command "${name}" is ambiguous.\nDid you mean one of these?\n${suggestions}`,
                found,
            );
        }

        return this.getCommand(exact ? name : found[0]);
    }

    public getNames(ns = "") {
        const commands = new XSet<string>();

        const names = [...this.commands.keys()];
        if (this.commandLoader) {
            names.push(...this.commandLoader.getNames());
        }

        for (const name of names) {
            if (!ns || ns === this.extractNamespace(name, substrCount(ns, ":") + 1)) {
                commands.add(name);
            }
        }

        return commands.toArray();
    }

    public extractNamespace(name: string, limit?: number) {
        const parts = name.split(":");
        parts.pop();

        return parts.slice(0, limit).join(":");
    }

    public setDefaultCommand(commandName: string) {
        this.defaultCommandName = commandName;

        return this;
    }

    protected findCommand(io: IO) {
        const input = io.input;
        const name = this.getCommandName(input) || this.defaultCommandName;

        if (input.hasParameterOption(["--help"], true)) {
            io.input = new RecordInput({command_name: name});
            return this.getCommand("help");
        }

        return this.find(name);
    }

    protected configureIO(io: IO) {
        const input = io.input;
        const output = io.output;

        if (input.hasParameterOption("--ansi", true)) {
            output.setDecorated(true);
        } else if (input.hasParameterOption("--no-ansi", true)) {
            output.setDecorated(false);
        }

        if (input.hasParameterOption("--no-interaction", true)) {
            input.setInteractive(false);
        }

        const verbosityLevels = {
            "--quiet": OutputVerbosity.QUIET,
            "-vvv": OutputVerbosity.DEBUG,
            "-vv": OutputVerbosity.VERY_VERBOSE,
            "-v": OutputVerbosity.VERBOSE,
            "--verbose": OutputVerbosity.VERBOSE,
        };

        for (const [option, verbosity] of entriesOf(verbosityLevels)) {
            if (input.hasParameterOption(option, true)) {
                output.setVerbosity(verbosity);
                break;
            }
        }
    }

    protected getCommandName(input: Input) {
        return input.hasArgument("command") ? input.getArgument("command") : input.getFirstArgument();
    }

    protected getAbbreviationSuggestions(abbrevs: string[]) {
        return "    " + abbrevs.join("\n    ");
    }

    protected findAlternatives(name: string, collection: string[]) {
        // todo
        return [];
    }

    protected extractAllNamespaces(name: string) {
        const parts = name.split(":");
        parts.pop();
        const namespaces = [];

        for (let i = 0; i < parts.length; i++) {
            const slice = parts.slice(0, i + 1);
            const ns = slice.join(":");
            namespaces.push(ns);
        }

        return namespaces;
    }
}
