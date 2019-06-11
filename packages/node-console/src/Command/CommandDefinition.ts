import {Str} from "@sirian/common";
import {Argument, InputDefinition, Option} from "../Input";

export class CommandDefinition {
    protected name: string;
    protected aliases: string[];
    protected help: string;
    protected description: string;
    protected inputDefinition: InputDefinition;

    constructor(name: string) {
        this.name = name;
        this.inputDefinition = new InputDefinition();
        this.description = "";
        this.help = "";
        this.aliases = [];
    }

    public getInputDefinition() {
        return this.inputDefinition;
    }

    public getHelp() {
        return this.help;
    }

    public getProcessedHelp() {
        const tokens = {
            "%name%": this.name,
        };

        return Str.replace(this.help, tokens);
    }

    public setHelp(help: string) {
        this.help = help;
        return this;
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public setDescription(description: string) {
        this.description = description;
        return this;
    }

    public getName() {
        return this.name;
    }

    public getDescription() {
        return this.description;
    }

    public getAliases() {
        return this.aliases;
    }

    public addOptions(options: Record<string, Option> | Option[]) {
        this.inputDefinition.addOptions(options);
        return this;
    }

    public setOptions(options: Record<string, Option> | Option[]) {
        this.inputDefinition.setOptions(options);
        return this;
    }

    public getOptions() {
        return this.inputDefinition.getOptions();
    }

    public addArguments(args: Record<string, Argument> | Argument[]) {
        this.inputDefinition.addArguments(args);
        return this;
    }

    public setArguments(args: Record<string, Argument> | Argument[]) {
        this.inputDefinition.setArguments(args);
        return this;
    }

    public getArguments() {
        return this.inputDefinition.getArguments();
    }
}
