import {CommandDefinition} from "../Command";
import {Argument, InputDefinition, Option} from "../Input";
import {ApplicationDescription} from "./ApplicationDescription";
import {Descriptor} from "./Descriptor";

export interface ICommandData {
    name: string;
    usage: string[];
    description: string;
    help: string;
    inputDefinition: InputDefinitionData;
}

export interface InputDefinitionData {
    arguments: Record<string, IArgumentData>;
    options: Record<string, IOptionData>;
}

export interface IArgumentData {
    name: string;
    is_required: boolean;
    is_array: boolean;
    description: string;
    defaultValue: any;
}

export interface IOptionData {
    name: string;
    shortcut: string;
    accept_value: boolean;
    is_value_required: boolean;
    is_multiple: boolean;
    description: string;
    default: any;
    defaultValue: any;
}

export class JsonDescriptor extends Descriptor {
    public describeArgument(argument: Argument) {
        this.writeData(this.getArgumentData(argument));
    }

    public describeOption(option: Option) {
        this.writeData(this.getOptionData(option));
    }

    public describeInputDefinition(definition: InputDefinition) {
        this.writeData(this.getInputDefinitionData(definition));
    }

    public describeCommand(definition: CommandDefinition) {
        this.writeData(this.getCommandData(definition));
    }

    public describeApplication(description: ApplicationDescription) {
        const namespace = description.namespace;

        const commands: ICommandData[] = [];

        for (const [/*name*/, command] of description.getCommands()) {
            commands.push(this.getCommandData(command));
        }

        if (namespace) {
            this.writeData({
                namespace,
                commands,
            });
        } else {
            const ns = description.getNamespaces();
            this.writeData({
                commands,
                namespaces: [...ns.values()],
            });
        }
    }

    protected writeData(data: any) {
        this.write(JSON.stringify(data));
    }

    protected getArgumentData(argument: Argument): IArgumentData {
        return {
            name: argument.getName(),
            is_required: argument.isRequired(),
            is_array: argument.isMultiple(),
            description: argument.getDescription().replace(/\s*[\n\r]\s*/g, " "),
            defaultValue: argument.getDefaultValue(),
        };
    }

    protected getOptionData(option: Option): IOptionData {
        return {
            name: "--" + option.getName(),
            shortcut: option.getShortcuts().length ? "-" + option.getShortcuts().join("|-") : "",
            accept_value: option.acceptValue(),
            is_value_required: option.isValueRequired(),
            is_multiple: option.isMultiple(),
            description: option.getDescription().replace(/\s*[\n\r]\s*/g, " "),
            default: option.getDefault(),
            defaultValue: option.getDefaultValue(),
        };
    }

    protected getInputDefinitionData(definition: InputDefinition): InputDefinitionData {
        const args: Record<string, IArgumentData> = {};

        for (const argument of definition.getArguments()) {
            args[argument.getName()] = this.getArgumentData(argument);
        }

        const opts: Record<string, IOptionData> = {};

        for (const option of definition.getOptions()) {
            opts[option.getName()] = this.getOptionData(option);
        }

        return {
            arguments: args,
            options: opts,
        };
    }

    protected getCommandData(definition: CommandDefinition): ICommandData {
        const usages = [definition.getName(), ...definition.getAliases()];

        const inputDefinitionData = this.getInputDefinitionData(definition.getInputDefinition());

        return {
            name: definition.getName(),
            usage: usages,
            description: definition.getDescription(),
            help: definition.getHelp(),
            inputDefinition: inputDefinitionData,
        };
    }
}
