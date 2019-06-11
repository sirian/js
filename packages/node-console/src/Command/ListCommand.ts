import {ApplicationDescription, DescriptorManager} from "../Descriptor";
import {Argument, BoolOption, Option} from "../Input";
import {Command} from "./Command";
import {CommandDefinition} from "./CommandDefinition";

export class ListCommand extends Command {
    public static configure(defintion: CommandDefinition) {
        defintion
            .setName("list")
            .setDescription("Lists commands")
            .setArguments({
                namespace: new Argument({description: "The namespace name"}),
            })
            .setOptions({
                raw: new BoolOption({description: "To output raw command list"}),
                format: new Option({
                    allowedValues: DescriptorManager.getInstance().getFormats(),
                    default: "txt",
                    description: "The output format",
                    valueRequired: true,
                }),
            })
            .setHelp(
                "The <info>%name%</info> command lists all commands:\n\n" +

                "  <info>node %name%</info>\n\n" +

                "You can also display the commands for a specific namespace:\n\n" +

                "  <info>node %name% test</info>\n\n" +

                "You can also output information in other formats using the <comment>--format</comment> option:\n\n" +

                "  <info>node %name% --format=json</info>\n\n" +

                "It's also possible to get raw list of commands (useful for embedding command runner):\n\n" +

                "  <info>node %name% --raw</info>");
    }

    protected async execute() {
        const input = this.input;

        const format = input.getOption("format");

        const descriptor = DescriptorManager.getInstance().createDescriptor(format, this.output);

        const ns = input.getArgument("namespace");
        const description = await ApplicationDescription.inspectApplication(this.application, ns);

        await descriptor.describeApplication(description);
    }
}
