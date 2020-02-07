import {Arr, stringifyVar} from "@sirian/common";
import {Writable} from "stream";
import {RuntimeError} from "../Error";
import {Formatter} from "../Formatter";
import {StrUtil} from "../Util";

export enum OutputVerbosity {
    QUIET,
    NORMAL,
    VERBOSE,
    VERY_VERBOSE,
    DEBUG,
}

export enum OutputType {
    NORMAL,
    RAW,
    PLAIN,
}

export interface IOutputOptions {
    stream: Writable;
    verbosity: OutputVerbosity;
    decorated: boolean;
    formatter?: Formatter;
}

export interface IOutputWriteOptions {
    newline: number;
    verbosity: OutputVerbosity;
    type: OutputType;
}

export type OutputStream = NodeJS.WritableStream & { isTTY?: boolean; columns?: number; rows?: number };

export abstract class Output {
    protected verbosity: OutputVerbosity;
    protected formatter: Formatter;
    protected stream: OutputStream;

    protected constructor(stream: OutputStream, init: Partial<IOutputOptions>) {
        this.stream = stream;

        const options = {
            verbosity: OutputVerbosity.NORMAL,
            decorated: stream.isTTY || false,
            ...init,
        };

        this.verbosity = options.verbosity;

        this.formatter =
            options.formatter ||
            new Formatter({
                decorated: options.decorated,
            });
    }

    public setFormatter(formatter: Formatter) {
        this.formatter = formatter;
        return this;
    }

    public getFormatter() {
        return this.formatter;
    }

    public setDecorated(decorated: boolean) {
        this.formatter.setDecorated(decorated);
        return this;
    }

    public isDecorated() {
        return this.formatter.isDecorated();
    }

    public getVerbosity() {
        return this.verbosity;
    }

    public setVerbosity(verbosity: OutputVerbosity) {
        this.verbosity = verbosity;
        return this;
    }

    public isQuiet() {
        return OutputVerbosity.QUIET === this.verbosity;
    }

    public isVerbose() {
        return OutputVerbosity.VERBOSE <= this.verbosity;
    }

    public isVeryVerbose() {
        return OutputVerbosity.VERY_VERBOSE <= this.verbosity;
    }

    public isDebug() {
        return OutputVerbosity.DEBUG <= this.verbosity;
    }

    public writeln(messages: string | string[] = [], init: Partial<IOutputWriteOptions> = {}) {
        return this.write(messages, {
            newline: 1,
            ...init,
        });
    }

    public newLine(n = 1) {
        if (n > 0) {
            this.doWrite("\n".repeat(n));
        }
        return this;
    }

    public write(messages: string | string[] = [], init: Partial<IOutputWriteOptions> = {}) {
        const options = {
            type: OutputType.NORMAL,
            verbosity: OutputVerbosity.NORMAL,
            newline: 0,
            ...init,
        };

        messages = Arr.cast(messages);

        if (options.verbosity > this.getVerbosity()) {
            return this;
        }

        const formatter = this.getFormatter();

        for (let message of messages) {
            message = stringifyVar(message);

            switch (options.type) {
                case OutputType.PLAIN:
                    message = StrUtil.stripTags(formatter.decorate(message));
                    break;
                case OutputType.RAW:
                    break;
                case OutputType.NORMAL:
                default:
                    message = formatter.decorate(message);
                    break;
            }
            this.doWrite(message);

            this.newLine(options.newline);
        }

        return this;
    }

    public abstract flush(): any;

    public getStream() {
        const stream = this.stream;

        if (!stream) {
            throw new RuntimeError("Stream is not set");
        }

        return stream;
    }

    public setStream(stream: Writable) {
        this.stream = stream;
    }

    public getWidth() {
        const max = Number.MAX_SAFE_INTEGER;

        const stream = this.getStream();

        if (stream) {
            return stream.columns || max;
        }

        return max;
    }

    public getHeight() {
        const max = Number.MAX_SAFE_INTEGER;

        const stream = this.getStream();

        if (stream) {
            return stream.rows || max;
        }

        return max;
    }

    protected abstract doWrite(message: string): void;
}
