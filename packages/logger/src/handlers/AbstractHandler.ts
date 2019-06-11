import {LogLevel} from "../AbstractLogger";
import {Logger} from "../Logger";
import {LogRecord} from "../LogRecord";
import {ILogHandler} from "./ILogHandler";

export interface AbstractHandlerInit {
    level?: LogLevel;
    bubble?: boolean;
}

export abstract class AbstractHandler implements ILogHandler {
    protected level: LogLevel;
    protected bubble: boolean;

    constructor(init: AbstractHandlerInit = {}) {
        this.level = init.level || LogLevel.INFO;
        this.bubble = false !== init.bubble;
    }

    public abstract handle(record: LogRecord): boolean | void;

    public handleBatch(records: LogRecord[]) {
        for (const record of records) {
            this.handle(record);
        }
    }

    public isHandling(record: LogRecord) {
        return Logger.getLevelWeight(record.level) >= Logger.getLevelWeight(this.level);
    }

    public setLevel(level: LogLevel) {
        this.level = level;
        return this;
    }
}
