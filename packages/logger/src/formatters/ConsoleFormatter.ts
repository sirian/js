import {isInstanceOf, Var} from "@sirian/common";
import {LogRecord} from "../LogRecord";
import {FormatContext} from "./FormatContext";
import {LineFormatter, LineFormatterInit} from "./LineFormatter";
import {Placeholder} from "./Placeholder";

export class ConsoleFormatter extends LineFormatter {
    constructor(init: Partial<LineFormatterInit> = {}) {
        super(init);

        this.addPlaceholders({
            o: (value, ph) => ph,
            O: (value, ph) => ph,
        });
    }

    public format(record: LogRecord) {
        const ctx = this.formatRecord(record);

        const values = ctx.getFormatted();

        const msg = [];
        const args = [];

        for (const v of values) {
            if (isInstanceOf(v, Placeholder)) {
                const type = v.type;
                const value = v.value;

                if (!type) {
                    args.push(value);
                    continue;
                }

                msg.push("%", type);
                args.push(value);

                continue;
            }

            msg.push(v);
        }

        const message = msg.map(Var.stringify).join("");

        ctx.setFormatted([message, ...args]);

        return ctx;
    }

    protected processPlaceholder(ctx: FormatContext, ph: Placeholder) {
        if (!ph.type) {
            const result = new Placeholder(ph.value, "o");
            ctx.push(result);
            return;
        }
        return super.processPlaceholder(ctx, ph);
    }

    protected processExtraArg(ctx: FormatContext, value: any) {
        ctx.push(new Placeholder(value));
    }
}
