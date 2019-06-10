import {DateTime} from "@sirian/datetime";
import {LogLevel} from "./AbstractLogger";

export interface LogRecordInit {
    args: any[];
    datetime?: DateTime;
    channel?: string;
    level?: LogLevel;
    extra?: Record<string, any>;
}

export class LogRecord implements LogRecordInit {
    public args: any[];
    public datetime: DateTime;
    public level: LogLevel;
    public channel: string;
    public extra: Record<string, any>;

    constructor(init: LogRecordInit) {
        this.datetime = init.datetime || new DateTime();
        this.level = init.level || LogLevel.INFO;
        this.channel = init.channel || "";
        this.extra = init.extra || {};
        this.args = init.args;
    }

    public clone() {
        return new LogRecord(this);
    }
}
