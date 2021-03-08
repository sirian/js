import {assert, ensureNotNull} from "./Error";
import {isFunction, isString} from "./Is";
import {jsonStringify} from "./Json";
import {parseNumber, toInt, toUint32} from "./Num";
import {getObjectTag} from "./Ref";
import {stringifyVar} from "./Stringify";
import {ensureMap} from "./XUtils";

interface Placeholder {
    placeholder: string;
    paramNum: number;
    keys?: string[];
    sign: boolean;
    padChar: string;
    align: boolean;
    width: number;
    precision: number;
    type: string;
}

type ParsedItem = Placeholder | string;
type ParsedTree = ParsedItem[];

export const sprintf = (format: string, ...args: any[]) => Sprintf.format(format, args);
export const vsprintf = (format: string, args: any[] = []) => Sprintf.format(format, args);

const substr = (arg: any, ph: Placeholder) => stringifyVar(arg).substr(0, ph.precision || stringifyVar(arg).length);

const rgxNumber = /[diefg]/;
const rgxJson = /[j]/;
const rgxText = /^[^%]+/;
const rgxEscapedPercent = /^%%/;
const rgxPlaceholder = /^%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/;
const rgxKey = /^([a-z_][a-z_\d]*)/i;
const rgxKeyAccess = /^\.([a-z_][a-z_\d]*)/i;
const rgxIndexAccess = /^\[(\d+)]/;

export class Sprintf {
    private static readonly _cache: Map<string, ParsedTree> = new Map();

    private readonly _pattern: string;
    private readonly _tree: ParsedTree;
    private _cursor: number = 0;

    private _placeholders: Record<string, (arg: any, ph: Placeholder) => string | number> = {
        b: (arg) => toInt(arg).toString(2),
        c: (arg) => String.fromCharCode(toInt(arg)),
        i: (arg) => toInt(arg),
        d: (arg) => toInt(arg),
        j: (arg, ph) => jsonStringify(arg, null, ph.width),
        e: (arg, ph) => parseNumber(arg).toExponential(ph.precision),
        f: (arg, ph) => ph.precision ? parseNumber(arg).toFixed(ph.precision) : parseNumber(arg),
        g: (arg, ph) => ph.precision ? +arg.toPrecision(ph.precision) : parseNumber(arg),
        o: (arg) => toUint32(arg).toString(8),
        s: (arg, ph) => substr(arg, ph),
        t: (arg, ph) => substr(!!arg, ph),
        T: (arg, ph) => substr(getObjectTag(arg).toLowerCase(), ph),
        u: (arg) => toUint32(arg),
        v: (arg, ph) => substr(arg.valueOf(), ph),
        x: (arg) => toUint32(arg).toString(16),
        X: (arg) => toUint32(arg).toString(16).toUpperCase(),
    };

    private constructor(pattern: string) {
        this._pattern = pattern;
        this._tree = ensureMap(Sprintf._cache, pattern, () => this._parse());
    }

    public static format(format = "", args: any[]) {
        return new Sprintf(format)._format(args);
    }

    public static escape(value: string) {
        return value.replace("%", "%%");
    }

    public static unescape(value: string) {
        return value.replace("%%", "%");
    }

    public resolveArg(ph: Placeholder, argv: any[]) {
        const keys = ph.keys;
        if (!keys) {
            if (ph.paramNum) { // positional argument (explicit)
                return argv[ph.paramNum - 1];
            } else { // positional argument (implicit)
                return argv[this._cursor++];
            }
        }

        // keyword argument
        return keys.reduce((obj, key) => obj?.[key], argv[this._cursor]);
    }

    private _parse() {
        const pattern = this._pattern;
        const tree: ParsedTree = [];

        let index = 0;

        while (index < pattern.length) {
            const str = pattern.substring(index);

            const textMatch = rgxText.exec(str);

            if (textMatch) {
                const tmp = textMatch[0];
                tree.push(tmp);
                index += tmp.length;
                continue;
            }

            const moduleMatch = rgxEscapedPercent.exec(str);
            if (moduleMatch) {
                tree.push("%");
                index += moduleMatch[0].length;
                continue;
            }

            const match = ensureNotNull(rgxPlaceholder.exec(str), "[sprintf] Unexpected token", {pattern, index});

            const item: Placeholder = {
                placeholder: match[0],
                paramNum: parseInt(match[1], 0),
                keys: this._parseKeys(match[2]),
                sign: !!match[3],
                padChar: (match[4] || " ").slice(-1),
                align: !!match[5],
                width: parseInt(match[6], 0),
                precision: parseInt(match[7], 0),
                type: match[8],
            };

            tree.push(item);

            index += match[0].length;
        }

        return tree;
    }

    private _parseKeys(field: string) {
        if (!field) {
            return;
        }

        const keys: string[] = [];

        let match = rgxKey.exec(field);

        while (true) {
            assert(match, "[sprintf] Failed to parse named argument key", {pattern: this._pattern, field});

            keys.push(match[1]);

            field = field.substring(match[0].length);

            if ("" === field) {
                break;
            }

            match = rgxKeyAccess.exec(field) || rgxIndexAccess.exec(field);
        }

        return keys;
    }

    private _handlePlaceholder(ph: Placeholder, arg: any) {
        const type = ph.type;
        const callback = ensureNotNull(this._placeholders[type], "[sprintf] Unknown placeholder", {pattern: this._pattern, type});

        if (!/^[Tv]/.test(type) && isFunction(arg)) {
            arg = arg();
        }

        return stringifyVar(callback(arg, ph));
    }

    private _format(args: any[]) {
        this._cursor = 0;

        const output: string[] = [];

        for (const ph of this._tree) {
            if (isString(ph)) {
                output.push(ph);
                continue;
            }

            const arg = this.resolveArg(ph, args);

            const type = ph.type;

            let argText = stringifyVar(this._handlePlaceholder(ph, arg));

            if (rgxJson.test(type)) {
                output.push(argText);
                continue;
            }

            let sign = "";
            if (rgxNumber.test(type)) {
                const isNegative = arg < 0;

                if (ph.sign || isNegative) {
                    sign = isNegative ? "-" : "+";
                    argText = argText.replace(/^[+-]/, "");
                }
            }

            const width = ph.width;
            const padLength = width - (sign.length + argText.length);

            const pad = width && padLength > 0 ? ph.padChar.repeat(padLength) : "";

            if (ph.align) {
                output.push(sign + argText + pad);
            } else if ("0" === ph.padChar) {
                output.push(sign + pad + argText);
            } else {
                output.push(pad + sign + argText);
            }
        }

        return output.join("");
    }
}
