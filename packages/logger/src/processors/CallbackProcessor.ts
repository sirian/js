import {LogRecord} from "../LogRecord";
import {ILogProcessor} from "./ILogProcessor";

export type ProcessorCallback = (record: LogRecord) => void;

export class CallbackProcessor implements ILogProcessor {
    public readonly callback: ProcessorCallback;

    constructor(callback: ProcessorCallback) {
        this.callback = callback;
    }

    public process(record: LogRecord) {
        this.callback(record);
    }
}
