import {Json} from "./Json";
import {Num} from "./Num";
import {Obj} from "./Obj";
import {Var} from "./Var";

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

export class Sprintf {
    public static readonly patterns = {
        number: /[diefg]/,
        json: /[j]/,
        text: /^[^%]+/,
        escapedPercent: /^%%/,
        placeholder: /^%(?:([1-9]\d*)\$|\(([^)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-gijostTuvxX])/,
        key: /^([a-z_][a-z_\d]*)/i,
        key_access: /^\.([a-z_][a-z_\d]*)/i,
        index_access: /^\[(\d+)]/,
    };

    public static readonly cache: Map<string, Sprintf> = new Map();

    protected tree: ParsedTree;

    protected placeholders: Record<string, (arg: any, ph: Placeholder) => string | number> = {
        b: (arg) => Num.toInt(arg).toString(2),
        c: (arg) => String.fromCharCode(Num.toInt(arg)),
        i: (arg) => Num.toInt(arg),
        d: (arg) => Num.toInt(arg),
        j: (arg, ph) => Json.stringify(arg, null, ph.width),
        e: (arg, ph) => Num.parse(arg).toExponential(ph.precision),
        f: (arg, ph) => ph.precision ? Num.parse(arg).toFixed(ph.precision) : Num.parse(arg),
        g: (arg, ph) => ph.precision ? +arg.toPrecision(ph.precision) : Num.parse(arg),
        o: (arg) => Num.toUint32(arg).toString(8),
        s: (arg, ph) => this.substr(arg, ph),
        t: (arg, ph) => this.substr(!!arg, ph),
        T: (arg, ph) => this.substr(Obj.getStringTag(arg).toLowerCase(), ph),
        u: (arg) => Num.toUint32(arg),
        v: (arg, ph) => this.substr(arg.valueOf(), ph),
        x: (arg) => Num.toUint32(arg).toString(16),
        X: (arg) => Num.toUint32(arg).toString(16).toUpperCase(),
    };

    private cursor: number = 0;

    constructor(format: string) {
        this.tree = this.parse(format);
    }

    public static format(format = "", args: any[]) {
        return Sprintf.parse(format).format(args);
    }

    public static parse(format: string) {
        const map = Sprintf.cache;

        if (!map.has(format)) {
            map.set(format, new Sprintf(format));
        }

        return map.get(format)!;
    }

    public static escape(value: string) {
        return value.replace("%", "%%");
    }

    public static unescape(value: string) {
        return value.replace("%%", "%");
    }

    public static isValid(format: string) {
        try {
            this.parse(format);
            return true;
        } catch (e) {
            return false;
        }
    }

    public resolveArg(ph: Placeholder, argv: any[]) {
        const keys = ph.keys;
        if (!keys) {
            if (ph.paramNum) { // positional argument (explicit)
                return argv[ph.paramNum - 1];
            } else { // positional argument (implicit)
                return argv[this.cursor++];
            }
        }

        // keyword argument
        let arg = argv[this.cursor];

        for (const [index, key] of keys.entries()) {
            if (null === arg || undefined === arg) {
                throw new Error(`[sprintf] Cannot access property "${key}" of undefined value "${keys[index - 1]}"`);
            }

            arg = arg[key];
        }

        return arg;
    }

    protected parse(format: string) {
        const tree: ParsedTree = [];

        let index = 0;
        const re = Sprintf.patterns;

        while (index < format.length) {
            const str = format.substring(index);

            const textMatch = re.text.exec(str);

            if (textMatch) {
                const tmp = textMatch[0];
                tree.push(tmp);
                index += tmp.length;
                continue;
            }

            const moduleMatch = re.escapedPercent.exec(str);
            if (moduleMatch) {
                tree.push("%");
                index += moduleMatch[0].length;
                continue;
            }

            const match = re.placeholder.exec(str);

            if (!match) {
                throw new SyntaxError(`Sprintf unexpected placeholder at index ${index}`);
            }

            const [text, paramNum, replacementField, sign, rawPadChar, align, width, precision, type] = match;

            const item: Placeholder = {
                placeholder: text,
                paramNum: Num.parseInt(paramNum, 0),
                keys: this.parseKeys(replacementField),
                sign: !!sign,
                padChar: (rawPadChar || " ").slice(-1),
                align: !!align,
                width: Num.parseInt(width, 0),
                precision: Num.parseInt(precision, 0),
                type,
            };

            tree.push(item);

            index += text.length;
        }

        return tree;
    }

    protected parseKeys(field: string) {
        if (!field) {
            return undefined;
        }

        const keys: string[] = [];

        const re = Sprintf.patterns;

        let match = re.key.exec(field);

        while (true) {
            if (!match) {
                throw new SyntaxError("[sprintf] failed to parse named argument key");
            }

            const [text, key] = match;

            keys.push(key);

            field = field.substring(text.length);

            if ("" === field) {
                break;
            }

            match = re.key_access.exec(field) || re.index_access.exec(field);
        }

        return keys;
    }

    protected handlePlaceholder(ph: Placeholder, arg: any) {
        const type = ph.type;
        const callback = this.placeholders[type];

        if (!callback) {
            throw new Error(`Formatter for "${type}" not found`);
        }

        if (!/^[Tv]/.test(type) && Var.isFunction(arg)) {
            arg = arg();
        }

        if (/[bcdiefguxX]/.test(type) && typeof arg !== "number" && isNaN(arg)) {
            throw new TypeError(`[sprintf] expecting number, given ${typeof arg} "${arg}"`);
        }

        return String(callback(arg, ph));
    }

    protected format(args: any[]) {
        this.cursor = 0;

        const output: string[] = [];
        const re = Sprintf.patterns;

        for (const ph of this.tree) {
            if ("string" === typeof ph) {
                output.push(ph);
                continue;
            }

            const arg = this.resolveArg(ph, args);

            const type = ph.type;

            let argText = String(this.handlePlaceholder(ph, arg));

            if (re.json.test(type)) {
                output.push(argText);
                continue;
            }

            let sign = "";
            if (re.number.test(type)) {
                const isPositive = arg >= 0;

                if (ph.sign || !isPositive) {
                    sign = isPositive ? "+" : "-";
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

    private substr(arg: any, ph: Placeholder) {
        const v = String(arg);
        return v.substr(0, ph.precision || v.length);
    }
}

export const sprintf = (format: string, ...args: any[]) => Sprintf.format(format, args);
export const vsprintf = (format: string, args: any[] = []) => Sprintf.format(format, args);
