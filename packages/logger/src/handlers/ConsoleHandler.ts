import {LogLevel} from "../AbstractLogger";
import {ConsoleFormatter, FormatContext} from "../formatters";
import {LogRecord} from "../LogRecord";
import {ProcessingHandler, ProcessingHandlerInit} from "./ProcessingHandler";

export interface Console {
    trace(...args: any[]): any;

    debug(...args: any[]): any;

    log(...args: any[]): any;

    info(...args: any[]): any;

    warn(...args: any[]): any;

    error(...args: any[]): any;
}

export interface ConsoleHandlerInit extends ProcessingHandlerInit {
    console?: Console;
}

declare const console: Console;

export class ConsoleHandler extends ProcessingHandler {
    protected levelWriters: Record<LogLevel, keyof Console>;

    protected console: Console;

    constructor(init: ConsoleHandlerInit = {}) {
        super(init);

        this.console = init.console || console;
        this.levelWriters = {
            [LogLevel.TRACE]: "trace",
            [LogLevel.DEBUG]: "debug",
            [LogLevel.INFO]: "info",
            [LogLevel.WARNING]: "warn",
            [LogLevel.ERROR]: "error",
            [LogLevel.FATAL]: "error",
        };
    }

    protected getDefaultFormatter() {
        return new ConsoleFormatter();
    }

    protected write(record: LogRecord, ctx: FormatContext) {
        const level = record.level;

        const method = this.levelWriters[level];
        const values = ctx.getFormatted();
        this.console[method](...values);
    }
}
