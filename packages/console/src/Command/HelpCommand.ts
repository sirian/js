import {tryCatch} from "@sirian/common";
import {DescriptorManager} from "../Descriptor";
import {Argument, BoolOption, Option} from "../Input";
import {Command} from "./Command";
import {CommandDefinition} from "./CommandDefinition";

export class HelpCommand extends Command {
    public static configure(definiton: CommandDefinition) {
        definiton
            .setName("help")
            .setDescription("Displays help for a command")
            .setArguments({
                command_name: new Argument({
                    description: "The command name",
                    defaultValue: "help",
                    required: false,
                }),
            })
            .setOptions({
                format: new Option({
                    allowedValues: DescriptorManager.getInstance().getFormats(),
                    default: "txt",
                    valueRequired: true,
                    description: `The output format`,
                }),
                raw: new BoolOption({
                    description: "To output raw command help",
                }),
            })
            .setHelp(
                "The <info>%name%</info> command displays help for a given command:\n\n" +

                "  <info>node %name% list</info>\n\n" +

                "You can also output the help in other formats by using the <comment>--format</comment> option:\n\n" +

                "  <info>node %name% --format=json list</info>\n\n" +

                "To display the list of available commands, please use the <info>list</info> command.");
    }

    protected bindInput() {
        tryCatch(() => super.bindInput());
    }

    protected async execute() {
        const input = this.input;
        const output = this.output;

        const commandName = input.getArgument("command_name");
        const command = await this.getApplication().find(commandName);

        const format = input.getOption("format");

        const descriptor = DescriptorManager.getInstance().createDescriptor(format, output);

        descriptor.describeCommand(command.getDefinition());
    }
}
