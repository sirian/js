import {XPromise} from "@sirian/xpromise";
import * as readline from "readline";
import {Formatter} from "../Formatter";
import {IO} from "../IO";
import {AbstractQuestion} from "./Question";

export class QuestionHelper {
    protected io: IO;

    constructor(io: IO) {
        this.io = io;
    }

    public async ask<T>(question: AbstractQuestion<T>) {
        if (!this.io.input.isInteractive()) {
            return question.getDefault();
        }

        const result = await this.attemptAsk(question);

        return result;
    }

    protected readline<T>(question: AbstractQuestion<T>): XPromise<string> {
        return new XPromise((resolve) => {
            const io = this.io;
            const output = io.output;

            const options: readline.ReadLineOptions = {
                completer: (line: string) => {
                    const hits = question.getCompletions(line);
                    return [hits, line];
                },
                input: io.input.getStream(),
                terminal: output.isDecorated(),
            };

            if (!question.isHidden()) {
                options.output = output.getStream();
            }

            const rl = readline.createInterface(options);

            rl.question(question.getPrompt(), (answer) => {
                resolve(answer || "");

                rl.close();
            });
        });
    }

    protected writeError(error: Error) {
        const output = this.io.errorOutput;

        const message = Formatter.formatBlock(error.message, "error");

        output.writeln(message);
    }

    private async doAsk<T>(question: AbstractQuestion<T>) {
        const output = this.io.output;

        output.writeln(question.getSynopsis());

        const ret = await this.readline(question);

        const defaultValue = question.getDefault();

        if (!ret && undefined !== defaultValue) {
            return defaultValue;
        }

        return question.normalize(ret);
    }

    private async attemptAsk<T>(question: AbstractQuestion<T>) {
        let error;

        let attempts = question.getMaxAttempts();

        do {
            if (error) {
                this.writeError(error);
            }

            try {
                return await this.doAsk(question);
            } catch (e) {
                error = e;
            }
        } while (--attempts > 0);

        throw error;
    }
}
