export enum LogLevel {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARNING = "warning",
    ERROR = "error",
    FATAL = "fatal",
}

export interface ILogger {
    trace(message?: any, ...args: any[]): any;

    debug(message?: any, ...args: any[]): any;

    info(message?: any, ...args: any[]): any;

    warning(message?: any, ...args: any[]): any;

    error(message?: any, ...args: any[]): any;

    fatal(message?: any, ...args: any[]): any;
}

export abstract class AbstractLogger implements ILogger {
    public trace(message?: any, ...args: any[]) {
        return this.log(LogLevel.TRACE, message, ...args);
    }

    public debug(message?: any, ...args: any[]) {
        return this.log(LogLevel.DEBUG, message, ...args);
    }

    public info(message?: any, ...args: any[]) {
        return this.log(LogLevel.INFO, message, ...args);
    }

    public warning(message?: any, ...args: any[]) {
        return this.log(LogLevel.WARNING, message, ...args);
    }

    public error(message?: any, ...args: any[]) {
        return this.log(LogLevel.ERROR, message, ...args);
    }

    public fatal(message?: any, ...args: any[]) {
        return this.log(LogLevel.FATAL, message, ...args);
    }

    public abstract log(level: LogLevel, message?: any, ...args: any[]): any;
}
