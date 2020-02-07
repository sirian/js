import {stringifyVar, XMap} from "@sirian/common";
import {Application} from "../Application";
import {CommandDefinition} from "../Command";
import {CommandNotFoundError} from "../Error";

export interface INamespaceDescription {
    id: string;
    commands: string[];
}

export class ApplicationDescription {
    public static GLOBAL_NAMESPACE = "_global";

    public readonly application: Application;

    public readonly namespace: string;
    protected readonly namespaces: Map<string, INamespaceDescription>;
    protected readonly commands: Map<string, CommandDefinition>;
    protected readonly aliases: Map<string, CommandDefinition>;
    protected inspected: boolean;

    constructor(application: Application, namespace: string = "") {
        this.application = application;
        this.namespace = namespace;
        this.namespaces = new Map();
        this.aliases = new Map();
        this.commands = new Map();
        this.inspected = false;
    }

    public static async inspectApplication(app: Application, namespace: string = "") {
        const desc = new ApplicationDescription(app, namespace);
        await desc.inspectApplication();
        return desc;
    }

    public getNamespaces() {
        return this.namespaces;
    }

    public getCommands() {
        return this.commands;
    }

    public getCommand(name: string) {
        const command = this.commands.get(name) || this.aliases.get(name);

        if (!command) {
            throw new CommandNotFoundError(`Command "${name}" does not exist.`);
        }

        return command;
    }

    protected async inspectApplication() {
        if (this.inspected) {
            return;
        }
        this.inspected = true;

        const namespace = this.namespace ? this.application.findNamespace(this.namespace) : "";

        const allNames = this.application.getNames(namespace);

        for (const [ns, commandNames] of this.sortCommands(allNames)) {
            for (const name of commandNames) {
                const command = await this.application.getCommand(name);
                const definition = command.getDefinition();

                if (definition.getName() === name) {
                    this.commands.set(name, definition);
                } else {
                    this.aliases.set(name, definition);
                }
            }

            this.namespaces.set(ns, {
                id: ns,
                commands: commandNames,
            });
        }
    }

    protected sortCommands(names: string[]) {
        const nsCommandNames: XMap<string, string[]> = new XMap(() => []);

        for (const name of names) {
            const namespace = this.application.extractNamespace(name, 1) || ApplicationDescription.GLOBAL_NAMESPACE;

            nsCommandNames.ensure(namespace).push(name);
        }

        XMap.sort(nsCommandNames, ([k1], [k2]) => stringifyVar(k1).localeCompare(k2));

        for (const nsNames of nsCommandNames.values()) {
            nsNames.sort((a, b) => stringifyVar(a).localeCompare(b));
        }

        return nsCommandNames;
    }
}
