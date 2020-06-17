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
        const {
            datetime = new DateTime(),
            level = LogLevel.INFO,
            extra = {},
            channel = "",
            args,
        } = init;

        this.datetime = datetime;
        this.level = level;
        this.channel = channel;
        this.extra = extra;
        this.args = args;
    }

    public clone() {
        return new LogRecord(this);
    }
}
