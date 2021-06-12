import {assert, ensureNotNull} from "./Error";
import {isString} from "./Is";
import {jsonStringify} from "./Json";
import {parseNumber, toInt, toUint32} from "./Num";
import {getObjectTag} from "./Ref";
import {stringifyVar} from "./Stringify";
import {toPrimitive} from "./Var";

const enum PL {
    PLACEHOLDER = 0,
    PARAM_NUM,
    KEYS,
    SIGN,
    PAD_CHAR,
    ALIGN,
    WIDTH,
    PRECISION,
    TYPE,
}

type Placeholder = [
    placeholder: string,
    paramNum: number,
    keys: undefined | string[],
    sign: boolean,
    padChar: string,
    align: boolean,
    width: number,
    precision: number | undefined,
    type: string,
];

type ParsedFormat = Array<Placeholder | string>;

const placeholders: Record<string, (arg: any, ph: Placeholder) => string | number> = {
    b: (v) => toInt(v).toString(2),
    c: (v) => String.fromCharCode(toInt(v)),
    i: (v) => toInt(v),
    d: (v) => toInt(v),
    j: (v, ph) => jsonStringify(v, null, ph[PL.WIDTH]),
    e: (v, ph) => parseNumber(v).toExponential(ph[PL.PRECISION]),
    f: (v, ph) => null == ph[PL.PRECISION] ? parseNumber(v) : parseNumber(v).toFixed(ph[PL.PRECISION]),
    g: (v, ph) => ph[PL.PRECISION] ? +v.toPrecision(ph[PL.PRECISION]) : parseNumber(v),
    o: (v) => toUint32(v).toString(8),
    s: (v, ph) => substr(v, ph),
    t: (v, ph) => substr(!!v, ph),
    T: (v, ph) => substr(getObjectTag(v).toLowerCase(), ph),
    u: (v) => toUint32(v),
    v: (v, ph) => substr(toPrimitive(v), ph),
    x: (v) => toUint32(v).toString(16),
    X: (v) => toUint32(v).toString(16).toUpperCase(),
};

const substr = (arg: any, ph: Placeholder) => stringifyVar(arg).substr(0, ph[PL.PRECISION] || 1 / 0);

export const sprintf = (format: string, ...args: any[]) => vsprintf(format, args);

export const vsprintf = (pattern: string, args: any[]) => {
    const output: string[] = [];

    const parsed = parse(pattern);

    let argCursor = 0;

    for (const ph of parsed) {
        if (isString(ph)) {
            output.push(ph);
            continue;
        }

        const [placeholder, paramNum, keys, sign, padChar, align, width, /*precision*/, type] = ph;

        const arg = keys
                    ? keys.reduce((obj, key) => obj?.[key], args[argCursor]) // keyword argument
                    : (paramNum
                       ? args[paramNum - 1] // positional argument (explicit)
                       : args[argCursor++]); // positional argument (implicit)

        const callback = ensureNotNull(
            placeholders[type],
            "[sprintf] Unknown format specifier \"" + type + "\" at \"" + placeholder + "\"");

        let argText = stringifyVar(callback(arg, ph));

        if ("j" === type) {
            output.push(argText);
            continue;
        }

        let signText = "";

        if ("d" === type || "i" === type || "e" === type || "f" === type || "g" === type) {
            const isNegativeArg = arg < 0;

            if (sign || isNegativeArg) {
                signText = isNegativeArg ? "-" : "+";
                if (argText.length && ("+" === argText[0] || "-" === argText[0])) {
                    argText = argText.substr(1);
                }
            }
        }

        const padLength = width - signText.length - argText.length;

        const pad = padChar.repeat(Math.max(0, width && padLength));

        const part = align
                     ? signText + argText + pad
                     : ("0" === padChar
                        ? signText + pad + argText
                        : pad + signText + argText);

        output.push(part);
    }

    return output.join("");
};

const parseKeys = (pattern: string, field: string) => {
    if (!field) {
        return;
    }

    const rgxKey = /^([a-z_][a-z_\d]*)/i;
    const rgxKeyAccess = /^\.([a-z_][a-z_\d]*)/i;
    const rgxIndexAccess = /^\[(\d+)]/;

    const keys: string[] = [];

    let match = rgxKey.exec(field);

    while (true) {
        assert(match, "[sprintf] Failed to parse named argument key", {pattern, field});

        keys.push(match[1]);

        field = field.substring(match[0].length);

        if ("" === field) {
            break;
        }

        match = rgxKeyAccess.exec(field) || rgxIndexAccess.exec(field);
    }

    return keys;
};

function parse(pattern: string) {
    const result: ParsedFormat = [];

    const rgx = /[^%]+|%%|(?:%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d*))?([a-zA-Z]))|(.)/g;

    for (const match of pattern.matchAll(rgx)) {
        const index = match.index;
        const [text, paramNum, keys, sign, padChar = " ", align, width, precision = "", type, unexpected] = match;

        assert(!unexpected, "[sprintf] Unexpected token", {pattern, index});

        if ("%" !== text[0]) {
            result.push(text);
            continue;
        }

        if ("%%" === text) {
            result.push("%");
            continue;
        }

        const ph: Placeholder = [
            text,
            parseInt(paramNum, 0),
            parseKeys(pattern, keys),
            !!sign,
            padChar.slice(-1),
            !!align,
            parseInt(width, 0),
            "" === precision ? void 0 : parseInt(precision, 0),
            type,
        ];

        result.push(ph);
    }

    return result;
}
