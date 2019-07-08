import {CommandDefinition} from "../Command";
import {Argument, InputDefinition, Option} from "../Input";
import {Output, OutputType} from "../Output";
import {ApplicationDescription} from "./ApplicationDescription";

export interface IDescribeOptions {
    namespace?: string;
}

export abstract class Descriptor {
    protected output: Output;

    constructor(output: Output) {
        this.output = output;
    }

    public abstract describeArgument(argument: Argument): void;

    public abstract describeCommand(definition: CommandDefinition): void;

    public abstract describeOption(option: Option, options: IDescribeOptions): void;

    public abstract describeInputDefinition(definition: InputDefinition, options: IDescribeOptions): void;

    public abstract describeApplication(description: ApplicationDescription): void;

    protected write(content: string, decorated: boolean = false) {
        this.output.write(content, {
            type: decorated ? OutputType.NORMAL : OutputType.RAW,
        });
    }
}
