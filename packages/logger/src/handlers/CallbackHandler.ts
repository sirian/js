import {isObject} from "@sirian/common";
import {FormatContext} from "../formatters/FormatContext";
import {LogRecord} from "../LogRecord";
import {ProcessingHandler, ProcessingHandlerInit} from "./ProcessingHandler";

type HandlerCallback = (record: LogRecord, ctx: FormatContext) => any;

export interface CallbackHandlerInit extends ProcessingHandlerInit {
    callback: HandlerCallback;
}

export class CallbackHandler extends ProcessingHandler {
    protected callback: HandlerCallback;

    constructor(init: CallbackHandlerInit | HandlerCallback) {
        if (isObject(init)) {
            super(init);
            this.callback = init.callback;
        } else {
            super();
            this.callback = init;
        }
    }

    protected write(record: LogRecord, ctx: FormatContext) {
        this.callback(record, ctx);
    }
}
