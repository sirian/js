import {LogLevel} from "../AbstractLogger";
import {Logger} from "../Logger";
import {LogRecord} from "../LogRecord";
import {ILogHandler} from "./ILogHandler";
import {ProcessingHandler, ProcessingHandlerInit} from "./ProcessingHandler";

export type ActivationStrategy = (record: LogRecord) => boolean;

export interface FingerCrossedHandlerInit extends ProcessingHandlerInit {
    handler: ILogHandler;
    activationStrategy?: ActivationStrategy; // Strategy which determines when this handler takes action
    bufferLimit?: number; // How many entries should be buffered at most, beyond that the oldest items are removed
}

export class FingersCrossedHandler extends ProcessingHandler {
    protected handler: ILogHandler;
    protected activationStrategy: ActivationStrategy;
    protected bufferLimit: number;

    protected buffer: LogRecord[] = [];

    constructor(init: FingerCrossedHandlerInit) {
        super(init);

        const options: FingerCrossedHandlerInit = {
            activationStrategy: (r) => Logger.getLevelWeight(r.level) >= Logger.getLevelWeight(LogLevel.WARNING),
            ...init,
        };

        this.activationStrategy = options.activationStrategy!;
        this.handler = options.handler;
        this.bufferLimit = options.bufferLimit || 100;
    }

    public isHandling(record: LogRecord) {
        return true;
    }

    public activate() {
        this.handler.handleBatch(this.buffer);
        this.clear();
    }

    public handle(record: LogRecord) {
        this.processRecord(record);

        const buffer = this.buffer;
        buffer.push(record);

        const extraRecords = buffer.length - this.bufferLimit;

        if (extraRecords > 0) {
            buffer.splice(0, extraRecords);
        }

        const activate = this.activationStrategy(record);

        if (activate) {
            this.activate();
        }

        return !this.bubble;
    }

    public clear() {
        this.buffer = [];
    }
}
