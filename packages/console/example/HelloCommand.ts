import {Argument, Command, CommandDefinition} from "../src";

export class HelloCommand extends Command {
    public static configure(definition: CommandDefinition) {
        definition
            .setName("hello")
            .setDescription("Output hello with provided name")
            .setArguments({
                name: new Argument({
                    description: "Your name",
                    required: true,
                }),
            });

    }

    public async execute() {
        const io = this.io;

        const name = io.input.getArgument("name");

        io.success("Great, you did it!");

        io.writeln(`Hello <info>${name}</info>!`);
    }
}
