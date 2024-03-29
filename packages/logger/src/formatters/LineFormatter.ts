import {isNumber, isString, jsonStringify, stringifyVar} from "@sirian/common";
import {DateTime} from "@sirian/datetime";
import {format as prettyFormat, OptionsReceived} from "pretty-format";
import {LogRecord} from "../LogRecord";
import {Parser, Token, TokenStream} from "../parser";
import {FormatContext} from "./FormatContext";
import {LogFormatter, LogFormatterInit} from "./LogFormatter";
import {Placeholder} from "./Placeholder";

export interface LineFormatterInit extends LogFormatterInit {
    lineFormat: string;
    parser: Parser;
}

export class LineFormatter extends LogFormatter {
    protected static DEFAULT_FORMAT = "{datetime|date:YYYY-MM-DD hh:mm:ss.sss} {channel|s}.{level|s}: {message}";

    protected lineFormat: string;
    protected parser: Parser;
    protected tokens: Token[];

    constructor(init: Partial<LineFormatterInit> = {}) {
        super(init);

        this.addPlaceholders({
            o: (value) => LineFormatter.pretty(value, {min: true}),
            O: (value) => LineFormatter.pretty(value),

            p: (value) => LineFormatter.pretty(value, {min: true}),
            P: (value) => LineFormatter.pretty(value),

            j: (value) => jsonStringify(value),
            J: (value, ph) => jsonStringify(value, void 0, +ph.options || 2),

            date: (value, ph) => DateTime.from(value).format(ph.options),
        });

        this.lineFormat = init.lineFormat || LineFormatter.DEFAULT_FORMAT;
        this.parser = init.parser || new Parser();
        this.tokens = this.parser.parse(this.lineFormat);
    }

    public static pretty(value: any, options?: OptionsReceived): string {
        if (isString(value) || isNumber(value)) {
            return stringifyVar(value);
        }
        return prettyFormat(value, options);
    }

    public formatMessage(record: LogRecord) {
        const [message, ...args] = record.args;

        let tokens: TokenStream;

        if (!isString(message)) {
            args.unshift(message);
            tokens = [];
        } else {
            tokens = this.parser.parse(message);

        }

        return this.processTokens(tokens, args);
    }

    protected formatRecord(record: LogRecord) {
        const args = {
            level: record.level.toUpperCase(),
            datetime: record.datetime,
            channel: record.channel,
            message: this.formatMessage(record),
            extra: record.extra,
        };

        return this.processTokens(this.tokens, [args]);
    }

    protected processExtraArg(ctx: FormatContext, value: any) {
        if (ctx.getFormatted().length) {
            ctx.push(" ");
        }
        this.processPlaceholder(ctx, new Placeholder(value, "o"));
    }
}
