import {assert} from "./Error";
import {isFunction, isNullish, isString} from "./Is";
import {jsonStringify, quoteSingle} from "./Json";
import {NullMap} from "./NullMap";
import {parseNumber, toInt, toUint32} from "./Num";
import {getObjectTag} from "./Ref";
import {stringifyVar} from "./Stringify";
import {isBetween, toPrimitive} from "./Var";
import {ensureMap, IMapMini} from "./XUtils";

export type Placeholder = Readonly<{
    text: string,
    argNum: number,
    keys: undefined | readonly string[],
    sign: boolean,
    padChar: string,
    align: boolean,
    width: number,
    precision: number | undefined,
    type: string,
}>;

export type PlaceholderFormatter = (arg: any, ph: Placeholder) => string | number;
export type Placeholders = Record<string, PlaceholderFormatter>;
export type SprintfPart = string | Placeholder;
export type SprintfParsed = SprintfPart[];

export const sprintf = (pattern: string, ...args: any[]) => Sprintf.instance.format(pattern, args);

export class Sprintf {
    private static _instance?: Sprintf;
    protected readonly _placeholders: Placeholders;
    private _cache: IMapMini<string, SprintfParsed> = new NullMap();

    public constructor(placeholders?: Placeholders) {
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const substr = (arg: any, ph: Placeholder) => stringifyVar(arg).slice(0, Math.max(0, ph.precision || 1 / 0));

        this._placeholders = {
            b: (v) => toInt(v).toString(2),
            c: (v) => String.fromCharCode(v),
            i: (v) => toInt(v),
            d: (v) => toInt(v),
            j: (v, ph) => substr(jsonStringify(v, void 0, ph.width), ph),
            e: (v, ph) => parseNumber(v).toExponential(ph.precision),
            f: (v, ph) => isNullish(ph.precision) ? parseNumber(v) : parseNumber(v).toFixed(ph.precision),
            g: (v, ph) => ph.precision ? +v.toPrecision(ph.precision) : parseNumber(v),
            o: (v) => toUint32(v).toString(8),
            s: (v, ph) => substr(v, ph),
            t: (v, ph) => substr(!!v, ph),
            T: (v, ph) => substr(getObjectTag(v).toLowerCase(), ph),
            u: (v) => toUint32(v),
            v: (v, ph) => substr(toPrimitive(v), ph),
            x: (v) => toUint32(v).toString(16),
            X: (v) => toUint32(v).toString(16).toUpperCase(),
            ...placeholders,
        };
    }

    public setCache(cache: IMapMini<string, SprintfParsed>) {
        this._cache = cache;
    }

    public static get instance() {
        return this._instance ??= new this();
    }

    public compile(pattern: string) {
        const parsed = this.parse(pattern);
        return (...args: any[]) => this._format(parsed, args).join("");
    }

    public format(pattern: string, args: any[]) {
        return this.compile(pattern)(...args);
    }

    public parse(pattern: string): SprintfParsed {
        const rgx = /[^%]+|%%|(?:%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d*))?([A-Za-z]))|(.)/g;

        return ensureMap(this._cache, pattern, () => [...pattern.matchAll(rgx)].map((match) => {
            const index = match.index;
            const [text, argNum, keys, sign, padChar = " ", align, width, precision = "", type, unexpected] = match;

            assert(!unexpected, () => new SyntaxError("Unexpected token at index " + quoteSingle(index) + " in: " + quoteSingle(pattern)));

            if ("%" !== text[0]) {
                return text;
            }

            if ("%%" === text) {
                return "%";
            }

            return ensureMap(this._cache, text, (): [Placeholder] => [Object.freeze({
                text,
                argNum: parseInt(argNum, 0),
                keys: this._parseKeys(pattern, keys),
                sign: !!sign,
                padChar: padChar.slice(-1),
                align: !!align,
                width: parseInt(width, 0),
                precision: "" === precision ? void 0 : parseInt(precision, 0),
                type,
            })])[0];
        }));
    }

    protected _parseKeys(pattern: string, fieldExpr: string) {
        if (!fieldExpr) {
            return;
        }
        let field = "." + fieldExpr;

        const rgxKeyAccess = /^\.([_a-z]\w*)/i;
        const rgxIndexAccess = /^\[(\d+)]/;

        const keys: string[] = [];

        while ("" !== field) {
            const match = rgxKeyAccess.exec(field) || rgxIndexAccess.exec(field);

            assert(
                match,
                () => new SyntaxError("Failed to parse named argument key " + quoteSingle(fieldExpr) + " in: " + quoteSingle(pattern)),
                {pattern, field},
            );

            keys.push(match[1]);

            field = field.slice(match[0].length);
        }

        return keys;
    }

    protected _format(parsed: SprintfParsed, args: any[]) {
        let argCursor = 0;

        return parsed.map((ph) => {
            if (isString(ph)) {
                return ph;
            }

            const {text, argNum, keys, type} = ph;

            const callback = this._placeholders[type];

            assert(
                isFunction(callback),
                () => new TypeError("Unknown format specifier " + quoteSingle(type) + " in: " + quoteSingle(text)),
            );

            let arg;

            if (keys) {
                arg = keys.reduce((obj, key) => obj?.[key], args[argCursor]);
            } else {
                const argIndex = argNum ? argNum - 1 : argCursor++;

                assert(
                    isBetween(argIndex, 0, args.length - 1),
                    () => new RangeError("Argument " + quoteSingle(argIndex) + " not provided"),
                );

                arg = args[argIndex];
            }

            return this._formatPlaceholder(callback, ph, arg);
        });
    }

    protected _formatPlaceholder(callback: PlaceholderFormatter, ph: Placeholder, arg: any) {
        const {sign, padChar, align, width, type} = ph;

        let argText = stringifyVar(callback(arg, ph));

        let signText = "";

        if ("d" === type || "i" === type || "e" === type || "f" === type || "g" === type) {
            const isNegativeArg = arg < 0;

            if (sign || isNegativeArg) {
                signText = isNegativeArg ? "-" : "+";
                argText = argText.replace(/^[+-]/, "");
            }
        }

        const pad = "".padStart(width - signText.length - argText.length, padChar);

        return align
               ? signText + argText + pad
               : ("0" === padChar ? signText + pad : pad + signText) + argText;
    }
}
