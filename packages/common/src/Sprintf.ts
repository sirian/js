import {assert, ensureNotNull} from "./Error";
import {isFunction, isString} from "./Is";
import {jsonStringify} from "./Json";
import {parseNumber, toInt, toUint32} from "./Num";
import {getObjectTag} from "./Ref";
import {stringifyVar} from "./Stringify";
import {ensureMap} from "./XUtils";

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
    precision: number,
    type: string,
];

type ParsedFormat = Array<Placeholder | string>;

const rgxNumber = /[diefg]/;
const rgxJson = /[j]/;
const rgxText = /^[^%]+/;
const rgxEscapedPercent = /^%%/;
const rgxPlaceholder = /^%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/;
const rgxKey = /^([a-z_][a-z_\d]*)/i;
const rgxKeyAccess = /^\.([a-z_][a-z_\d]*)/i;
const rgxIndexAccess = /^\[(\d+)]/;

const placeholders: Record<string, (arg: any, ph: Placeholder) => string | number> = {
    b: (arg) => toInt(arg).toString(2),
    c: (arg) => String.fromCharCode(toInt(arg)),
    i: (arg) => toInt(arg),
    d: (arg) => toInt(arg),
    j: (arg, ph) => jsonStringify(arg, null, ph[PL.WIDTH]),
    e: (arg, ph) => parseNumber(arg).toExponential(ph[PL.PRECISION]),
    f: (arg, ph) => ph[PL.PRECISION] ? parseNumber(arg).toFixed(ph[PL.PRECISION]) : parseNumber(arg),
    g: (arg, ph) => ph[PL.PRECISION] ? +arg.toPrecision(ph[PL.PRECISION]) : parseNumber(arg),
    o: (arg) => toUint32(arg).toString(8),
    s: (arg, ph) => substr(arg, ph),
    t: (arg, ph) => substr(!!arg, ph),
    T: (arg, ph) => substr(getObjectTag(arg).toLowerCase(), ph),
    u: (arg) => toUint32(arg),
    v: (arg, ph) => substr(arg.valueOf(), ph),
    x: (arg) => toUint32(arg).toString(16),
    X: (arg) => toUint32(arg).toString(16).toUpperCase(),
};

const cache: Map<string, ParsedFormat> = new Map();

const substr = (arg: any, ph: Placeholder) => stringifyVar(arg).substr(0, ph[PL.PRECISION] || 1 / 0);

export const sprintf = (format: string, ...args: any[]) => vsprintf(format, args);

export const vsprintf = (pattern: string, args: any[]) => {
    const output: string[] = [];
    const parsed = ensureMap(cache, pattern, parse);

    let argCursor = 0;

    for (const ph of parsed) {
        if (isString(ph)) {
            output.push(ph);
            continue;
        }

        const [/*placeholder*/, paramNum, keys, sign, padChar, align, width, /*precision*/, type] = ph;

        const rawArg = keys
                       ? keys.reduce((obj, key) => obj?.[key], args[argCursor]) // keyword argument
                       : (paramNum
                          ? args[paramNum - 1] // positional argument (explicit)
                          : args[argCursor++]); // positional argument (implicit)

        const arg = !/^[Tv]/.test(type) && isFunction(rawArg) ? rawArg() : rawArg;

        const callback = ensureNotNull(placeholders[type], "[sprintf] Unknown format specifier \"" + type + "\"", {
            pattern,
            type,
        });

        let argText = stringifyVar(callback(arg, ph));

        if (rgxJson.test(type)) {
            output.push(argText);
            continue;
        }

        let signText = "";
        if (rgxNumber.test(type)) {
            const isNegativeArg = arg < 0;

            if (sign || isNegativeArg) {
                signText = isNegativeArg ? "-" : "+";
                argText = argText.replace(/^[+-]/, "");
            }
        }

        const padLength = width - signText.length - argText.length;

        const pad = width && padLength > 0 ? padChar.repeat(padLength) : "";

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

    let index = 0;

    while (index < pattern.length) {
        const str = pattern.substring(index);

        const textMatch = rgxText.exec(str);

        if (textMatch) {
            const tmp = textMatch[0];
            result.push(tmp);
            index += tmp.length;
            continue;
        }

        const moduleMatch = rgxEscapedPercent.exec(str);
        if (moduleMatch) {
            result.push("%");
            index += moduleMatch[0].length;
            continue;
        }

        const match = ensureNotNull(rgxPlaceholder.exec(str), "[sprintf] Unexpected token", {pattern, index});

        const ph: Placeholder = [
            match[0],
            parseInt(match[1], 0),
            parseKeys(pattern, match[2]),
            !!match[3],
            (match[4] || " ").slice(-1),
            !!match[5],
            parseInt(match[6], 0),
            parseInt(match[7], 0),
            match[8],
        ];

        result.push(ph);

        index += match[0].length;
    }

    return result;
}
