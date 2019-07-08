import {Var} from "@sirian/common";
import {Application} from "../Application";
import {LogicError} from "../Error";
import {Input, InputDefinition} from "../Input";
import {IO} from "../IO";
import {Output} from "../Output";
import {CommandDefinition} from "./CommandDefinition";

export interface ICommandConstructor<A extends Application = any> {
    new(definition: CommandDefinition, application: A, io: IO): Command<A>;

    create(application: A, io: IO): Command<A>;

    getDefinition(): CommandDefinition;
}

export class Command<A extends Application = Application> {
    protected application: A;
    protected definition: CommandDefinition;
    protected inputDefinition: InputDefinition;
    protected io: IO;
    protected input: Input;
    protected output: Output;

    constructor(definition: CommandDefinition, application: A, io: IO) {
        this.definition = definition;
        this.application = application;
        this.io = io;
        this.input = io.input;
        this.output = io.output;
        this.inputDefinition = Command.mergeApplicationDefinition(definition, application);

        this.bindInput();
    }

    public static configure(definition: CommandDefinition) {
    }

    public static create<A extends Application, C extends ICommandConstructor<A>>(this: C, app: A, io: IO) {
        const definition = this.getDefinition();
        return new this(definition, app, io) as InstanceType<C>;
    }

    public static getDefinition() {
        const definition = new CommandDefinition(this.guessName());
        this.configure(definition);
        return definition;
    }

    public static guessName() {
        return Var.stringify(this.name)
            .replace(/Command$/, "")
            .replace(/\.?([A-Z]+)/g, (_, s) => "-" + Var.stringify(s).toLowerCase())
            .replace(/^-/, "");
    }

    public static mergeApplicationDefinition(definition: CommandDefinition, application: Application) {
        const appInput = application.getInputDefinition();
        const input = definition.getInputDefinition();

        return new InputDefinition([
            ...appInput.getOptions(),
            ...appInput.getArguments(),
            ...input.getOptions(),
            ...input.getArguments(),
        ]);
    }

    public async run() {
        const input = this.input;

        // The command name argument is often omitted when a command is executed directly with its run() method.
        // It would fail the validation if we didn't make sure the command argument is present,
        // since it's required by the application.
        if (input.hasArgument("command") && !input.getArgument("command")) {
            input.setArgument("command", this.definition.getName());
        }

        this.input.validate();

        return this.execute();
    }

    public getArgument(name: string) {
        return this.input.getArgument(name);
    }

    public getOption(name: string) {
        return this.input.getOption(name);
    }

    public getApplication() {
        return this.application;
    }

    protected bindInput() {
        this.input.bind(this.inputDefinition);
    }

    protected execute(): any {
        throw new LogicError("You must override the execute() method in the concrete command class.");
    }
}
