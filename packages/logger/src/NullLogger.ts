import {AbstractLogger, LogLevel} from "./AbstractLogger";

export class NullLogger extends AbstractLogger {
    public log(level: LogLevel, message?: any, ...args: any[]) {
        // do nothing
    }
}
