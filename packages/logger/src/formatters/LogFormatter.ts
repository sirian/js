import {entriesOf, isInstanceOf, isString, sprintf} from "@sirian/common";
import {FormatContext} from "@sirian/logger";
import {LogRecord} from "../LogRecord";
import {PlaceholderToken, TagToken, TokenStream} from "../parser/token";
import {IFormatter} from "./IFormatter";
import {Placeholder} from "./Placeholder";

type PlaceholderFormatCallback = (value: any, ph: Placeholder, ctx: FormatContext) => any;

export interface LogFormatterInit {
    placeholders: Record<string, PlaceholderFormatCallback>;
}

export type ILogFormatter = IFormatter<LogRecord, FormatContext>;

export abstract class LogFormatter implements ILogFormatter {
    protected placeholders: Record<string, PlaceholderFormatCallback> = {};

    constructor(init: Partial<LogFormatterInit> = {}) {
        this.setPlaceholders({
            d: (v, ph) => LogFormatter.sprintf(v, ph),
            i: (v, ph) => LogFormatter.sprintf(v, ph),
            f: (v, ph) => LogFormatter.sprintf(v, ph),
            s: (v, ph) => LogFormatter.sprintf(v, ph),
            t: (value) => new Placeholder(typeof value, "s"),
            o: (value, ph) => ph,
            O: (value, ph) => ph,
            extra: (value, ph) => ph,

            ...init.placeholders,
        });
    }

    public static sprintf(value: any, ph: Placeholder) {
        const format = "%" + ph.options + ph.type;
        return new Placeholder(sprintf(format, value), "s");
    }

    public format(record: LogRecord): FormatContext {
        return this.formatRecord(record);
    }

    public setPlaceholder(type: string, fn: PlaceholderFormatCallback) {
        this.placeholders[type] = fn;
        return this;
    }

    public addPlaceholders(placeholders: Record<string, PlaceholderFormatCallback>) {
        for (const [key, value] of entriesOf(placeholders)) {
            this.setPlaceholder(key, value);
        }
        return this;
    }

    public setPlaceholders(placeholders: Record<string, PlaceholderFormatCallback>) {
        this.placeholders = {};
        this.addPlaceholders(placeholders);
        return this;
    }

    protected abstract formatRecord(record: LogRecord): FormatContext;

    protected processTokens(tokens: TokenStream, args: any[]) {
        const ctx = new FormatContext(args);

        for (const token of tokens) {
            if (isString(token)) {
                ctx.push(token);
            }

            if (isInstanceOf(token, PlaceholderToken)) {
                this.processPlaceholderToken(ctx, token);
            }

            if (isInstanceOf(token, TagToken)) {
                this.processTagToken(ctx, token);
            }
        }

        for (const value of ctx.getExtraArgs()) {
            this.processExtraArg(ctx, value);
        }

        return ctx;
    }

    protected processExtraArg(ctx: FormatContext, value: any) {
        // no-op
    }

    protected processTagToken(ctx: FormatContext, token: TagToken) {
        // no-op
    }

    protected processPlaceholderToken(ctx: FormatContext, token: PlaceholderToken) {
        const value = ctx.getArgument(token.path);

        if (isInstanceOf(value, FormatContext)) {
            ctx.push(...value.getFormatted());
            return;
        }

        const ph = new Placeholder(value, token.type || "o", token.options);

        this.processPlaceholder(ctx, ph);
    }

    protected processPlaceholder(ctx: FormatContext, ph: Placeholder) {
        const type = ph.type;

        if (!type) {
            ctx.push(ph);
            return;
        }

        const fn = this.placeholders[type];

        if (!fn) {
            throw new Error(`Placeholder "${type}" not found`);
        }

        const result = fn(ph.value, ph, ctx);

        ctx.push(result);
    }
}
