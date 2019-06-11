import {LogRecord} from "../LogRecord";

export interface ILogHandler {
    handle(record: LogRecord): boolean | void;

    handleBatch(records: LogRecord[]): void;

    isHandling(record: LogRecord): boolean;
}
