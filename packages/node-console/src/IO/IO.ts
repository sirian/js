import {Str, Var} from "@sirian/common";
import * as ErrorStackParser from "error-stack-parser";
import {Formatter} from "../Formatter";
import {ArgvInput, Input} from "../Input";
import {IOutputWriteOptions, Output, OutputVerbosity, StdioOutput} from "../Output";
import {Block, IBlockOptions, ProgressBar, QuestionHelper} from "../UI";
import {
    AbstractQuestion,
    ChoiceQuestion,
    ConfirmationQuestion,
    IChoiceQuestionOptions,
    IConfirmationQuestionOptions,
    IQuestionOptions,
    Question,
} from "../UI/Question";
import {Table} from "../UI/Table";
import {StrUtil} from "../Util";

export class IO {
    public input: Input;
    public output: Output;
    public errorOutput: Output;

    protected questionHelper: QuestionHelper;

    constructor(input: Input = new ArgvInput(), output: Output = new StdioOutput()) {
        this.input = input;
        this.output = output;
        this.errorOutput = output instanceof StdioOutput ? output.getErrorOutput() : output;
        this.questionHelper = new QuestionHelper(this);
    }

    public block(messages: string | string[], options: Partial<IBlockOptions> = {}) {
        const block = new Block(this.output, options);
        block.render(messages);
        this.newLine();
        return this;
    }

    public success(message: string | string[]) {
        return this.block(message, {
            type: "[OK]",
            style: ["black", "bgGreen"],
        });
    }

    public error(message: string | string[]) {
        return this.block(message, {
            type: "[ERROR]",
            style: ["white", "bgRed"],
        });
    }

    public warning(message: string | string[]) {
        return this.block(message, {
            type: "[WARNING]",
            style: ["black", "bgYellow"],
        });
    }

    public ask(question: string, options: Partial<IQuestionOptions<string>> = {}) {
        const q = new Question({
            question,
            ...options,
        });

        return this.askQuestion(q);
    }

    public confirm(question: string, options: Partial<IConfirmationQuestionOptions> = {}) {
        const q = new ConfirmationQuestion({
            question,
            ...options,
        });

        return this.askQuestion(q);
    }

    public choice<T>(options: Partial<IChoiceQuestionOptions<T>>) {
        const q = new ChoiceQuestion<T>(options);

        return this.askQuestion(q);
    }

    public createTable(headers: any[] = [], rows: any[][] = []) {
        return new Table(this.output, headers, rows);
    }

    public createProgressBar(max = 0) {
        return new ProgressBar(this.output, max);
    }

    public renderError(e: Error) {
        const stack = ErrorStackParser.parse(e);

        const output = this.errorOutput;

        let len = 0;
        let title = "";

        const message = Var.stringify(e.message).trim();

        if ("" === message || output.isVerbose()) {
            title = `  [${e.name || e.constructor.name}]  `;
            len = StrUtil.width(title);
        }

        const width = output.getWidth();
        const lines: Array<[string, number]> = [];

        if (message) {
            for (const line of message.split(/\r?\n/)) {
                for (const chunk of StrUtil.splitByWidth(line, width - 4)) {
                    const lineLength = StrUtil.width(chunk) + 4;
                    lines.push([chunk, lineLength]);
                    if (lineLength > len) {
                        len = lineLength;
                    }
                }
            }
        }

        const messages = [];

        const emptyLine = `<error>${StrUtil.spaces(len)}</error>`;

        messages.push(emptyLine);

        if ("" === message || output.isVerbose()) {
            messages.push(`<error>${Str.padRight(title, len)}</error>`);
        }

        for (const [line, lineLength] of lines) {
            messages.push(`<error>  ${Formatter.escape(line)}  ${StrUtil.spaces(len - lineLength)}</error>`);
        }

        messages.push(emptyLine);
        messages.push("");

        if (output.isVerbose() && stack.length) {
            messages.push("<comment>Error trace:</comment>");

            for (const frame of stack) {
                const fn = frame.functionName || "{anonymous}";
                const args = (frame.args || []).join(", ");
                const file = frame.fileName || "";
                const line = frame.lineNumber;
                const col = frame.columnNumber;

                messages.push(
                    Formatter.format(`  %s(%s) at <info>%s</info> <comment>%d:%d</comment>`, fn, args, file, line, col),
                );
            }
            messages.push("");
            messages.push("");
        }

        output.writeln(messages, {verbosity: OutputVerbosity.QUIET});
    }

    public async askQuestion<T>(question: AbstractQuestion<T>) {
        const interactive = this.input.isInteractive();

        const answer = await this.questionHelper.ask(question);

        if (interactive) {
            this.newLine();
        }

        return answer;
    }

    public writeln(messages: string | string[], options: Partial<IOutputWriteOptions> = {}) {
        this.output.writeln(messages, options);
        return this;
    }

    public write(messages: string | string[], options: Partial<IOutputWriteOptions> = {}) {
        this.output.write(messages, options);

        return this;
    }

    public newLine(count = 1) {
        this.output.newLine(count);

        return this;
    }
}
