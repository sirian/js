import {isFunction, isString} from "./Is";
import {keysOf} from "./Obj";
import {rgxEscape} from "./Rgx";
import {stringifyVar} from "./Stringify";

export const enum StrSide {
    LEFT = "left",
    RIGHT = "right",
    BOTH = "both",
}

export type ReplaceCallback = (substring: string, ...args: any[]) => string;

export class Str {
    public static stringify(value: any) {
        // String(Symbol.iterator) === 'Symbol(Symbol.iterator)'
        // ("" + Symbol.iterator) throws Error
        return String(value);
    }

    public static wrap(value: any, wrapChar: string, escapeChar: string = "\\") {
        const escapeCharRgx = new RegExp(rgxEscape(escapeChar), "g");
        const wrapCharRgx = new RegExp(rgxEscape(wrapChar), "g");

        const escaped = stringifyVar(value)
            .replace(escapeCharRgx, escapeChar + escapeChar)
            .replace(wrapCharRgx, escapeChar + wrapChar);

        return wrapChar + escaped + wrapChar;
    }

    public static padRight(str: any, maxLength: number, chars: string = " ") {
        return Str.pad(str, maxLength, chars, StrSide.RIGHT);
    }

    public static padLeft(str: any, maxLength: number, chars: string = " ") {
        return Str.pad(str, maxLength, chars, StrSide.LEFT);
    }

    public static pad(str: any, maxLength: number, chars: string = " ", side: StrSide = StrSide.LEFT) {
        str = stringifyVar(str);
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

    public static isEqual(a?: string, b?: string, sensitive = true) {
        return isString(a)
            && isString(b)
            && (sensitive ? a === b : a.toUpperCase() === b.toUpperCase());
    }

    public static repeat(chars: string, maxLength: number) {
        chars = stringifyVar(chars);

        if (maxLength <= 0 || !chars) {
            return "";
        }

        return chars
            .repeat(Math.ceil(maxLength / chars.length))
            .substr(0, maxLength);
    }

    public static trimLeft(value: any, mask?: string) {
        return Str.trim(value, mask, StrSide.LEFT);
    }

    public static trimRight(value: any, mask?: string) {
        return Str.trim(value, mask, StrSide.RIGHT);
    }

    public static trim(value: any, mask: string = " \t\n\r\0\x0B", type: StrSide = StrSide.BOTH) {
        const str = stringifyVar(value);

        const maskPattern = [...mask].map(rgxEscape).join("|");

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

        return str.replace(new RegExp(parts.join("|"), "gu"), "");
    }

    public static camelCase(value: any) {
        const re = /[-_\s]+(.)?/g;
        return Str.trim(value).replace(re, (s, c) => c ? c.toUpperCase() : "");
    }

    public static dashCase(value: any) {
        return Str.trim(value)
            .replace(/([A-Z])/g, "-$1")
            .replace(/[-_\s]+/g, "-")
            .toLowerCase();
    }

    public static caseFirst(value: any, type: "lower" | "upper", locale: boolean = false) {
        const str = stringifyVar(value);

        const ch = str.charAt(0);
        const first = type === "lower"
                      ? (locale ? ch.toLocaleLowerCase() : ch.toLowerCase())
                      : (locale ? ch.toLocaleUpperCase() : ch.toUpperCase());

        return first + str.slice(1);
    }

    public static lowerFirst(value: any, locale: boolean = false) {
        return Str.caseFirst(value, "lower", locale);
    }

    public static upperFirst(value: any, locale: boolean = false) {
        return Str.caseFirst(value, "upper", locale);
    }

    public static replace(value: any, pairs: Record<string, string | ReplaceCallback>) {
        const str = stringifyVar(value);

        if (!str) {
            return str;
        }

        const keys = keysOf(pairs)
            .sort()
            .reverse();

        const pattern = keys.map(rgxEscape).join("|");

        const re = new RegExp(pattern, "g");

        return str.replace(re, (key) => {
            const v = pairs[key];
            return isFunction(v) ? v(key) : v;
        });
    }

    public static substringCount(str: string, substr: string) {
        str = stringifyVar(str);
        substr = stringifyVar(substr);

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

    public static split(value: string, re: string | RegExp, limit: number = Number.MAX_SAFE_INTEGER) {
        const str = stringifyVar(value);

        if (limit <= 0) {
            return [];
        }

        const res = [];
        let lastIndex = 0;

        for (const match of str.matchAll(new RegExp(re, "g"))) {
            const delimiter = match[0];

            const index = match.index!;

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
}
