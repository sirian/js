import {AbstractLogger, LogLevel} from "./AbstractLogger";
import {ILogHandler} from "./handlers";
import {LogRecord} from "./LogRecord";
import {ILogProcessor} from "./processors";

export interface LoggerInit {
    name?: string;
    handlers?: ILogHandler[];
    processors?: ILogProcessor[];
}

export class Logger extends AbstractLogger {
    public static readonly levelWeights: Record<LogLevel, number> = {
        [LogLevel.TRACE]: 100,
        [LogLevel.DEBUG]: 200,
        [LogLevel.INFO]: 300,
        [LogLevel.WARNING]: 400,
        [LogLevel.ERROR]: 500,
        [LogLevel.FATAL]: 600,
    };

    protected name: string;
    protected handlers: ILogHandler[];
    protected processors: ILogProcessor[];

    constructor(init: LoggerInit = {}) {
        super();
        this.name = init.name || "app";
        this.handlers = [...init.handlers || []];
        this.processors = [...init.processors || []];
    }

    public static getLevelWeight(level: LogLevel) {
        return this.levelWeights[level];
    }

    public pushHandler(handler: ILogHandler) {
        this.handlers.unshift(handler);
        return this;
    }

    public popHandler() {
        return this.handlers.shift();
    }

    public pushProcessor(processor: ILogProcessor) {
        this.processors.unshift(processor);
        return this;
    }

    public popProcessor() {
        return this.processors.shift();
    }

    public getName() {
        return this.name;
    }

    public log(level: LogLevel, ...args: any[]): LogRecord {
        const record = new LogRecord({
            args,
            channel: this.name,
            level,
        });

        for (const processor of this.processors) {
            processor.process(record);
        }

        for (const handler of this.handlers) {
            const stopBubble = handler.handle(record.clone());
            if (stopBubble) {
                break;
            }
        }

        return record;
    }
}
