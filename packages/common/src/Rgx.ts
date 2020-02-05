import {isNullish, isRegExp, isString, Var} from "./Var";
import {XSet} from "./XSet";

const escapeRe = /[|\\{}()[\]^$+*?.]/g;

export interface RgxInit {
    flags: string | string[];
    addFlags: string | string[];
}

export class Rgx {
    public static create(pattern: string | RegExp, options: Partial<RgxInit>): RegExp;
    public static create(pattern: string | RegExp, flags?: string): RegExp;

    public static create(pattern: string, options: string | Partial<RgxInit> = "") {
        if (isString(options)) {
            return Rgx.create(pattern, {flags: options});
        }

        const {flags, addFlags} = options;

        const resFlags = new XSet<string>();

        if (!isNullish(flags)) {
            resFlags.add(...flags);
        } else if (isRegExp(pattern)) {
            resFlags.add(...pattern.flags);
        }

        if (addFlags) {
            resFlags.add(...addFlags);
        }

        const source = isRegExp(pattern) ? pattern.source : pattern;

        return new RegExp(source, resFlags.toArray().join(""));
    }

    public static escape(str: string) {
        return Var.stringify(str).replace(escapeRe, "\\$&"); // $& means the whole matched string
    }

    public static* matchAll(subject: string, pattern: RegExp | string) {
        const regex = Rgx.create(pattern, {addFlags: "g"});
        const str = Var.stringify(subject);

        let lastIndex = 0;

        while (true) {
            const match = regex.exec(str);
            if (!match) {
                break;
            }
            yield match;

            // matchAll("foo", /()/)
            if (lastIndex === regex.lastIndex) {
                regex.lastIndex++;
            }
            lastIndex = regex.lastIndex;
        }
    }
}
