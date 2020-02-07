import {Arr, isArray, sprintf, stringifyVar} from "@sirian/common";
import {InvalidArgumentError} from "../Error";
import {TTYStyle} from "../TTY";
import {KV, StrUtil} from "../Util";
import {FormatterStyle} from "./FormatterStyle";
import {FormatterStyleStack} from "./FormatterStyleStack";

export type FormatterStyleDefinition = string | TTYStyle | TTYStyle[];

export interface IFormatterOptions {
    decorated: boolean;
    styles: Record<string, FormatterStyle | TTYStyle[]>;
}

export class Formatter {
    protected decorated: boolean;
    protected styles: Record<string, FormatterStyle> = {};
    protected styleStack: FormatterStyleStack;

    constructor(options: Partial<IFormatterOptions>) {
        this.decorated = !!options.decorated;

        this.styleStack = new FormatterStyleStack();

        this.styles = {};

        this.addStyles({
            normal: ["black", "bgWhite"],
            inverse: ["white", "bgBlack"],
            error: ["white", "bgRed"],
            info: ["green"],
            comment: ["yellow"],
            question: ["black", "bgCyan"],
            ...options.styles,
        });
    }

    public static formatBlock(messages: string | string[], style?: FormatterStyleDefinition, large = false) {
        messages = Arr.cast(messages);

        let maxLength = 0;
        const lines: Array<[string, number]> = [];
        for (let message of messages) {
            message = Formatter.escape(message);
            const length = StrUtil.width(message) + (large ? 4 : 2);
            maxLength = Math.max(length, maxLength);

            const line = sprintf(large ? "  %s  " : " %s ", message);

            lines.push([line, length]);
        }

        messages = lines.map(([line, length]) => line + StrUtil.spaces(maxLength - length));

        if (large) {
            const emptyLine = StrUtil.spaces(maxLength);
            messages.unshift(emptyLine);
            messages.push(emptyLine);
        }

        return messages.map((msg) => this.formatText(msg, style)).join("\n");
    }

    public static formatText(value: string, style?: FormatterStyleDefinition) {
        if (!style) {
            return value;
        }

        value = stringifyVar(value);

        return `<${style}>${value}</>`;
    }

    public static escape(text: string = ""): string {
        text = stringifyVar(text).replace(/([^\\]?)</gi, (tmp, match) => {
            return match + "\\<";
        });

        return this.escapeTrailingBackslash(text);
    }

    public static escapeTrailingBackslash(text: string) {
        if (!text.endsWith("\\")) {
            return text;
        }

        const len = text.length;
        text = text.replace(/\\+$/, "");
        text = text.replace(/\0/g, "");
        text += "\0".repeat(len - text.length);
        return text;
    }

    public static format(template: string, ...args: any[]) {
        return sprintf(template, ...args.map((arg) => Formatter.escape(arg)));
    }

    public removeDecoration(str: string) {
        const isDecorated = this.isDecorated();
        try {
            this.setDecorated(false);
            // remove <...> formatting
            str = this.decorate(str);
            // remove already formatted characters
            str = str.replace(/\033\[[^m]*m/g, "");

            return str;
        } finally {
            this.setDecorated(isDecorated);
        }
    }

    public widthWithoutDecoration(str: string) {
        return StrUtil.width(this.removeDecoration(str));
    }

    public setDecorated(decorated: boolean) {
        this.decorated = decorated;
        return this;
    }

    public isDecorated() {
        return this.decorated;
    }

    public addStyles(styles: Record<string, FormatterStyle | TTYStyle[]>) {
        for (const [name, style] of KV.entries(styles)) {
            this.setStyle(name, style);
        }
    }

    public setStyle(name: string, style: FormatterStyle | TTYStyle[]) {
        name = this.normalizeStyleName(name);

        if (isArray(style)) {
            style = new FormatterStyle(style);
        }

        this.styles[name] = style;

        return this;
    }

    public hasStyle(name: string) {
        name = this.normalizeStyleName(name);
        return !!this.styles[name];
    }

    public getStyle(name: string) {
        name = this.normalizeStyleName(name);

        const style = this.styles[name];

        if (!style) {
            throw new InvalidArgumentError(`Undefined style: ${name}`);
        }

        return style;
    }

    public decorate(message: string): string {
        message = stringifyVar(message);
        let offset: number = 0;
        const output: string[] = [];
        const tagRegex: string = "[a-z][a-z0-9_=,;-]*";
        const r: RegExp = new RegExp("<((" + tagRegex + ")|/(" + tagRegex + ")?)>", "ig");

        while (true) {
            const match = r.exec(message);

            if (!match) {
                break;
            }

            const pos = match.index;
            const text = match[0];

            if (0 !== pos && "\\" === message[pos - 1]) {
                continue;
            }

            // add the text up to the next tag
            output.push(this.applyCurrentStyle(message.substring(offset, pos)));

            offset = pos + text.length;

            const open = "/" !== text[1];
            const tag = match[open ? 1 : 3] || "";

            const styleStack = this.styleStack;

            if (!open && !tag) {
                // </>
                styleStack.pop();
            } else {
                const style = this.createStyleFromString(tag);

                if (!style) {
                    output.push(this.applyCurrentStyle(text));
                } else if (open) {
                    styleStack.push(style);
                } else {
                    styleStack.pop(style);
                }
            }
        }

        output.push(this.applyCurrentStyle(message.substr(offset)));

        return output.join("").replace(/\\<|\0/g, (text) => {
            switch (text) {
                case "\\<":
                    return "<";
                case "\0":
                    return "\\";
                default:
                    return "";
            }
        });
    }

    public getStyles() {
        return this.styles;
    }

    public getStyleStack() {
        return this.styleStack;
    }

    public applyCurrentStyle(text: string) {
        if (!text || !this.isDecorated()) {
            return text;
        }
        return this.styleStack.getCurrent().apply(text);
    }

    protected normalizeStyleName(name: string) {
        return stringifyVar(name).toLowerCase();
    }

    private createStyleFromString(str: string) {
        if (this.hasStyle(str)) {
            return this.getStyle(str);
        }

        const options = stringifyVar(str).split(/[,;]+/) as TTYStyle[];

        if (options.some((opt) => !FormatterStyle.isValid(opt))) {
            return;
        }

        return new FormatterStyle(options);
    }
}
