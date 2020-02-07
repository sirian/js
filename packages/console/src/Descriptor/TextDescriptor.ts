import {Arr, isArray, stringifyVar} from "@sirian/common";
import {CommandDefinition} from "../Command";
import {Formatter} from "../Formatter";
import {Argument, InputDefinition, Option} from "../Input";
import {Table} from "../UI/Table";
import {StrUtil} from "../Util";
import {ApplicationDescription} from "./ApplicationDescription";
import {Descriptor, IDescribeOptions} from "./Descriptor";

export class TextDescriptor extends Descriptor {
    public describeArgument(argument: Argument, options: IDescribeOptions = {}) {
        const defaultValue = argument.getDefaultValue();

        const desc = [
            argument.getDescription(),
        ];

        if (isArray(defaultValue) || StrUtil.width(defaultValue)) {
            desc.push(`<comment> [default: ${this.formatDefaultValue(defaultValue)}]</comment>`);
        }

        return [`<info>${argument.getName()}</info>`, desc.join("")];
    }

    public describeOption(option: Option, options: IDescribeOptions = {}) {
        const defaultValue = option.getDefault();

        const desc = [option.getDescription()];

        if (option.acceptValue() && undefined !== defaultValue && (!isArray(defaultValue) || defaultValue.length)) {
            desc.push(`<comment> [default: ${this.formatDefaultValue(defaultValue)}]</comment>`);
        }

        const synopsis = option.getSynopsis();

        const allowedValues = option.getAllowedValues();

        if (allowedValues.length) {
            const str = allowedValues.map(stringifyVar).join(", ");
            desc.push(` (Allowed values: <comment>${str}</comment>)`);
        }

        return [
            `<info>${synopsis}</info>`,
            desc.join(""),
        ];
    }

    public describeInputDefinition(definition: InputDefinition, options: IDescribeOptions = {}) {
        const opts = definition.getOptions();

        const args = definition.getArguments();

        if (args.length) {
            this.writeComment("Arguments:").writeEOL();

            const table = this.createTable();
            for (const argument of args) {
                const row = this.describeArgument(argument, options);
                table.addRow(row);
            }

            table.render();
        }

        if (args.length && opts.length) {
            this.writeEOL();
        }

        if (opts.length) {
            const laterOptions: Option[] = [];

            this.writeComment("Options:");

            const table = this.createTable();
            for (const option of opts) {
                if (option.getShortcuts().length) {
                    laterOptions.push(option);
                    continue;
                }
                const row = this.describeOption(option, options);
                table.addRow(row);
            }
            for (const option of laterOptions) {
                const row = this.describeOption(option, options);
                table.addRow(row);
            }
            table.render();
        }
    }

    public describeCommand(definition: CommandDefinition) {
        const description = definition.getDescription();
        const padding = "  ";
        if (description) {
            this.writeComment("Description:")
                .writeEOL()
                .writeText([padding, description])
                .writeEOL(2);
        }

        this.writeComment("Usage:");

        const inputDefinition = definition.getInputDefinition();

        const usage = `${definition.getName()} ${inputDefinition.getSynopsis(true)}`;

        this.writeEOL()
            .writeText([padding, Formatter.escape(usage)])
            .writeEOL();

        if (inputDefinition.getOptions().length || inputDefinition.getArguments().length) {
            this.writeEOL();
            this.describeInputDefinition(inputDefinition);
            this.writeEOL();
        }

        const help = definition.getProcessedHelp();

        if (help) {
            this.writeEOL()
                .writeComment("Help:")
                .writeEOL()
                .writeText([padding, help.replace(/\n/g, "\n" + padding)])
                .writeEOL();
        }
    }

    public describeApplication(description: ApplicationDescription) {
        const describedNamespace = description.namespace;
        const application = description.application;

        const help = application.getHelp();

        if (help) {
            this.writeText(help).writeEOL(2);
        }

        this.writeComment("Usage:")
            .writeEOL()
            .writeText("  command [options] [arguments]")
            .writeEOL(2);

        const def = new InputDefinition({
            options: application.getInputDefinition().getOptions(),
        });

        this.describeInputDefinition(def, {namespace: describedNamespace});

        this.writeEOL(2);

        const commands = new Map(description.getCommands());
        const namespaces = description.getNamespaces();
        if (describedNamespace && namespaces.size) {
            // make sure all alias commands are included when describing a specific namespace
            const info = namespaces.get(describedNamespace);
            if (info) {
                for (const name of info.commands) {
                    commands.set(name, description.getCommand(name));
                }
            }
        }

        const width = this.getColumnWidth(commands.values());

        if (describedNamespace) {
            this.writeComment(`Available commands for the "${describedNamespace}" namespace:`);
        } else {
            this.writeComment("Available commands:");
        }

        // add commands by namespace
        for (const [/*ns*/, namespace] of description.getNamespaces()) {
            const cmds = namespace.commands.filter((name) => commands.has(name));

            if (!cmds.length) {
                continue;
            }

            if (!describedNamespace && ApplicationDescription.GLOBAL_NAMESPACE !== namespace.id) {
                this.writeEOL().writeComment(namespace.id);
            }

            for (const name of cmds) {
                const spacingWidth = width - StrUtil.width(name);
                const command = commands.get(name)!;

                const commandAliases = name === command.getName() ? this.getCommandAliasesText(command) : "";

                this.writeEOL().writeText([
                    `  <info>${name}</info>`,
                    StrUtil.spaces(spacingWidth),
                    commandAliases,
                    command.getDescription(),
                ]);
            }
        }

        this.writeEOL();
    }

    protected createTable() {
        const table = new Table(this.output);

        table.getStyle()
            .setHorizontalBorderChars("")
            .setVerticalBorderChars(" ")
            .setDefaultCrossingChar("");

        return table;
    }

    protected writeComment(message: string) {
        const text = Formatter.formatText(message, "comment");
        return this.writeText(text);
    }

    protected writeEOL(count = 1) {
        this.write("\n".repeat(count));
        return this;
    }

    protected writeText(content: string | string[]) {
        const str = Arr.cast(content).map((v: any) => stringifyVar(v)).join("");
        this.write(str, true);

        return this;
    }

    protected getCommandAliasesText(definition: CommandDefinition) {
        const aliases = definition.getAliases();

        if (!aliases.length) {
            return "";
        }

        const text = aliases.join("|");
        return stringifyVar(`[${text}]`);
    }

    protected formatDefaultValue(defaultValue: undefined | string | string[]) {
        if (isArray(defaultValue)) {
            defaultValue = defaultValue.map((value) => Formatter.escape(value));
            return JSON.stringify(defaultValue).replace(/\\\\/g, "\\");
        } else {
            return Formatter.escape(defaultValue);
        }
    }

    protected getColumnWidth(commands: Iterable<CommandDefinition>) {
        let max = 0;

        for (const command of commands) {
            max = Math.max(max, StrUtil.width(command.getName()));

            for (const alias of command.getAliases()) {
                max = Math.max(max, StrUtil.width(alias));
            }
        }

        return max + 2;
    }
}
