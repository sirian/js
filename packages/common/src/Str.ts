import {Obj} from "./Obj";
import {Rgx} from "./Rgx";
import {Unicode} from "./Unicode";
import {Var} from "./Var";

export const enum StrSide {
    LEFT = "left",
    RIGHT = "right",
    BOTH = "both",
}

export type ReplaceCallback = (substring: string, ...args: any[]) => string;

export const Str = new class {
    public stringify(value: any) {
        // String(Symbol.iterator) === 'Symbol(Symbol.iterator)'
        // ("" + Symbol.iterator) throws Error
        return String(value);
    }

    public wrap(value: any, wrapChar: string, escapeChar: string = "\\") {
        const escapeCharRgx = Rgx.create(Rgx.escape(escapeChar), "g");
        const wrapCharRgx = Rgx.create(Rgx.escape(wrapChar), "g");

        const escaped = Var.stringify(value)
            .replace(escapeCharRgx, escapeChar + escapeChar)
            .replace(wrapCharRgx, escapeChar + wrapChar);

        return wrapChar + escaped + wrapChar;
    }

    public padRight(str: any, maxLength: number, chars: string = " ") {
        return Str.pad(str, maxLength, chars, StrSide.RIGHT);
    }

    public padLeft(str: any, maxLength: number, chars: string = " ") {
        return Str.pad(str, maxLength, chars, StrSide.LEFT);
    }

    public pad(str: any, maxLength: number, chars: string = " ", side: StrSide = StrSide.LEFT) {
        str = Var.stringify(str);
        const length = str.length;
        const padLength = maxLength - length;

        switch (side) {
            case StrSide.LEFT:
                return Str.repeat(chars, padLength) + str;
            case StrSide.RIGHT:
                return str + Str.repeat(chars, padLength);
            default:
                const mid = padLength / 2;
                const left = Str.repeat(chars, Math.ceil(mid));
                const right = Str.repeat(chars, Math.floor(mid));
                return left + str + right;
        }
    }

    public repeat(chars: string, maxLength: number) {
        chars = Var.stringify(chars);

        if (maxLength <= 0 || !chars) {
            return "";
        }

        return chars
            .repeat(Math.ceil(maxLength / chars.length))
            .substr(0, maxLength);
    }

    public trimLeft(value: any, mask?: string) {
        return Str.trim(value, mask, StrSide.LEFT);
    }

    public trimRight(value: any, mask?: string) {
        return Str.trim(value, mask, StrSide.RIGHT);
    }

    public trim(value: any, mask: string = " \t\n\r\0\x0B", type: StrSide = StrSide.BOTH) {
        const str = Var.stringify(value);

        const maskChars = Unicode.from(mask).symbols;

        const maskPattern = maskChars.map(Rgx.escape).join("|");

        const parts = [];

        if (StrSide.BOTH === type || StrSide.LEFT === type) {
            parts.push("^(?:" + maskPattern + ")+");
        }

        if (StrSide.BOTH === type || StrSide.RIGHT === type) {
            parts.push("(?:" + maskPattern + ")+$");
        }

        if (!parts.length) {
            return str;
        }

        const re = Rgx.create(parts.join("|"), "gu");

        return str.replace(re, "");
    }

    public camelCase(value: any) {
        const re = /[-_\s]+(.)?/g;
        return Str.trim(value).replace(re, (s, c) => c ? c.toUpperCase() : "");
    }

    public dashCase(value: any) {
        return Str.trim(value)
            .replace(/([A-Z])/g, "-$1")
            .replace(/[-_\s]+/g, "-")
            .toLowerCase();
    }

    public caseFirst(value: any, type: "lower" | "upper", locale: boolean = false) {
        const str = Var.stringify(value);

        if (!str) {
            return "";
        }

        const chars = [...str];
        const ch = chars[0];

        if (type === "lower") {
            chars[0] = locale ? ch.toLocaleLowerCase() : ch.toLowerCase();
        } else {
            chars[0] = locale ? ch.toLocaleUpperCase() : ch.toUpperCase();
        }

        return chars.join("");
    }

    public lowerFirst(value: any, locale: boolean = false) {
        return Str.caseFirst(value, "lower", locale);
    }

    public upperFirst(value: any, locale: boolean = false) {
        return Str.caseFirst(value, "upper", locale);
    }

    public replace(value: any, pairs: Record<string, string | ReplaceCallback>) {
        const str = Var.stringify(value);

        if (!str) {
            return str;
        }

        const keys = Obj
            .keys(pairs)
            .sort()
            .reverse();

        const pattern = keys.map(Rgx.escape).join("|");

        const re = Rgx.create(pattern, "g");

        return str.replace(re, (key) => {
            const v = pairs[key];
            return Var.isFunction(v) ? v(key) : v;
        });
    }

    public substringCount(str: string, substr: string) {
        str = Var.stringify(str);
        substr = Var.stringify(substr);

        if (!str || !substr) {
            return 0;
        }

        let pos = 0;

        for (let count = 0; ; count++) {
            pos = str.indexOf(substr, pos);
            if (-1 === pos) {
                return count;
            }
            pos += substr.length;
        }
    }

    public split(value: string, re: string | RegExp, limit: number = Number.MAX_SAFE_INTEGER) {
        const str = Var.stringify(value);

        if (limit <= 0) {
            return [];
        }

        const res = [];
        let lastIndex = 0;

        for (const match of Rgx.matchAll(str, re)) {
            const delimiter = match[0];

            const index = match.index;

            const part = str.substr(lastIndex, index - lastIndex);

            res.push(part);

            if (res.length >= limit) {
                res[res.length - 1] = str.substr(lastIndex);
                return res;
            }

            lastIndex = index + delimiter.length;
        }

        res.push(str.substr(lastIndex));

        return res;
    }
};
