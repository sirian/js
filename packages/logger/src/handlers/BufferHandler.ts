import {LogRecord} from "../LogRecord";
import {ProcessingHandler, ProcessingHandlerInit} from "./ProcessingHandler";

export interface BufferHandlerInit extends ProcessingHandlerInit {
    bufferLimit?: number; // How many entries should be buffered at most, beyond that the oldest items are removed
}

export class BufferHandler extends ProcessingHandler {
    protected bufferLimit: number;
    protected buffer: LogRecord[] = [];

    constructor(init: BufferHandlerInit = {}) {
        super(init);
        this.bufferLimit = init.bufferLimit || 100;
    }

    public get length() {
        return this.buffer.length;
    }

    public handle(record: LogRecord) {
        if (record.level < this.level) {
            return;
        }

        const buffer = this.buffer;

        this.processRecord(record);

        buffer.push(record);

        const extraRecords = buffer.length - this.bufferLimit;

        if (extraRecords > 0) {
            buffer.splice(0, extraRecords);
        }

        return !this.bubble;
    }

    public getBuffer() {
        return this.buffer;
    }

    public clear() {
        this.buffer = [];
    }
}
