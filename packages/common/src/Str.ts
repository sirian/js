import {ToString} from "@sirian/ts-extra-types";
import {isFunction} from "./Is";
import {keysOf} from "./Obj";
import {rgxEscape} from "./Rgx";
import {stringifyVar} from "./Stringify";

export const enum StrSide {
    LEFT = "left",
    RIGHT = "right",
    BOTH = "both",
}

export type ReplaceCallback = (substring: string, ...args: any[]) => string;

export const padRight = (str: any, maxLength: number, chars: string = " ") => pad(str, maxLength, chars, StrSide.RIGHT);

export const padLeft = (str: any, maxLength: number, chars: string = " ") => pad(str, maxLength, chars, StrSide.LEFT);

export const pad = (str: any, maxLength: number, chars: string = " ", side: StrSide = StrSide.LEFT) => {
    str = stringifyVar(str);
    const length = str.length;
    const padLength = maxLength - length;

    if (StrSide.LEFT === side) {
        return strRepeat(chars, padLength) + str;
    }

    if (StrSide.RIGHT === side) {
        return str + strRepeat(chars, padLength);
    }

    const mid = padLength / 2;
    const left = strRepeat(chars, Math.ceil(mid));
    const right = strRepeat(chars, Math.floor(mid));
    return left + str + right;
};

export const trim = (value: any, mask: string = " \t\n\r\0\x0B", type: StrSide = StrSide.BOTH) => {
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
};

export const strRepeat = (chars: string, maxLength: number) => {
    chars = stringifyVar(chars);

    if (maxLength <= 0 || !chars) {
        return "";
    }

    return chars
        .repeat(Math.ceil(maxLength / chars.length))
        .substr(0, maxLength);
};

export const trimLeft = (value: any, mask?: string) => trim(value, mask, StrSide.LEFT);

export const trimRight = (value: any, mask?: string) => trim(value, mask, StrSide.RIGHT);

export const lowerFirst = <T extends string>(value: T) =>
    (stringifyVar(value).charAt(0).toLowerCase() + stringifyVar(value).slice(1)) as `${Uncapitalize<ToString<T>>}`;

export const upperFirst = <T extends string>(value: T) =>
    (stringifyVar(value).charAt(0).toUpperCase() + stringifyVar(value).slice(1)) as `${Capitalize<T>}`;

export const strReplace = (value: any, pairs: Record<string, string | ReplaceCallback>) => {
    const str = stringifyVar(value);

    if (!str) {
        return str;
    }

    const keys = keysOf(pairs).sort().reverse();

    const pattern = keys.map(rgxEscape).join("|");

    const re = new RegExp(pattern, "g");

    return str.replace(re, (key) => {
        const v = pairs[key];
        return isFunction(v) ? v(key) : v;
    });
};

export const camelCase = (value: any) => trim(value).replace(/[-_\s]+(.)?/g, (s, c) => c ? c.toUpperCase() : "");

export const dashCase = (value: any) => trim(value)
    .replace(/([A-Z])/g, "-$1")
    .replace(/[-_\s]+/g, "-")
    .toLowerCase();

export const substrCount = (str: string, substr: string) => {
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
};

export const strSplit = (value: string, re: string | RegExp, limit: number = Number.MAX_SAFE_INTEGER) => {
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
};

export const strWrap = (value: any, wrapChar: string, escapeChar: string = "\\") => {
    const escapeCharRgx = new RegExp(rgxEscape(escapeChar), "g");
    const wrapCharRgx = new RegExp(rgxEscape(wrapChar), "g");

    const escaped = stringifyVar(value)
        .replace(escapeCharRgx, escapeChar + escapeChar)
        .replace(wrapCharRgx, escapeChar + wrapChar);

    return wrapChar + escaped + wrapChar;
};

export const strGraphemes = (str: any) => stringifyVar(str).match(/(\P{M}\p{M}*)/gu) || [];
