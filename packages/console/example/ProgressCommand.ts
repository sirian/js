import {Command, CommandDefinition, NumberOption, Option, ProgressBar} from "../src";

export class ProgressCommand extends Command {
    public static configure(definition: CommandDefinition) {
        definition
            .setName("progress")
            .setDescription("Examples of ProgressBar")
            .setOptions({
                max: new NumberOption({
                    shortcut: "m",
                    description: "Maximum steps",
                    valueRequired: true,
                    default: 100,
                }),
                timeout: new NumberOption({
                    shortcut: "t",
                    description: "Delay between steps in ms",
                    valueRequired: true,
                    default: 50,
                }),
                format: new Option({
                    shortcut: "f",
                    allowedValues: Object.keys(ProgressBar.formats),
                    description: "ProgressBar format style",
                    valueRequired: true,
                    default: "default",
                }),
            });

    }

    public async execute() {
        const io = this.io;
        const input = io.input;

        const max = +input.getOption("max");
        const timeout = +input.getOption("timeout");

        const progress = io.createProgressBar(max);
        const format = input.getOption("format");
        progress.setFormat(format);

        io
            .writeln(`Max steps: <comment>${max}</comment>`)
            .writeln(`Timeout  : <comment>${timeout}</comment>ms`)
            .writeln(`Format   : <comment>${format}</comment>`)
        ;

        for (let i = 0; i < progress.getMaxSteps(); i++) {
            progress.advance();
            await new Promise((resolve) => setTimeout(resolve, timeout));
        }
    }
}
