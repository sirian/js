import {FormatContext, ILogFormatter, LineFormatter} from "../formatters";
import {LogRecord} from "../LogRecord";
import {ILogProcessor} from "../processors";
import {AbstractHandler, AbstractHandlerInit} from "./AbstractHandler";

export interface ProcessingHandlerInit extends AbstractHandlerInit {
    formatter?: ILogFormatter;
    processors?: ILogProcessor[];
    bubble?: boolean;
}

export class ProcessingHandler extends AbstractHandler {
    protected formatter?: ILogFormatter;
    protected processors: ILogProcessor[];

    constructor(init: ProcessingHandlerInit = {}) {
        super(init);
        this.formatter = init.formatter;
        this.processors = init.processors || [];
    }

    public handle(record: LogRecord) {
        if (!this.isHandling(record)) {
            return;
        }

        this.processRecord(record);

        const formatter = this.getFormatter();

        const formatted = formatter.format(record);

        this.write(record, formatted);

        return !this.bubble;
    }

    public getFormatter() {
        if (!this.formatter) {
            this.formatter = this.getDefaultFormatter();
        }
        return this.formatter!;
    }

    protected processRecord(record: LogRecord) {
        for (const processor of this.processors) {
            processor.process(record);
        }
    }

    protected write(record: LogRecord, ctx: FormatContext) {
        // Noops
    }

    protected getDefaultFormatter(): ILogFormatter {
        return new LineFormatter();
    }
}
