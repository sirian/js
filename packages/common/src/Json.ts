import {JSONValue} from "@sirian/ts-extra-types";
import {isSome, stringifyVar} from "./Var";

export class Json {
    public static stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;
    public static stringify(value: any, replacer?: Array<number | string> | null, space?: string | number): string;

    public static stringify(value: any, ...args: any[]) {
        if (undefined === value) {
            value = null;
        }

        // todo: make safe circular data
        return JSON.stringify(value, ...args);
    }

    public static parse<T extends JSONValue | undefined>(text?: string | null, fn?: (key: any, value: any) => any) {
        if (null === text) {
            return null;
        }

        if (isSome(text, [undefined, "", "undefined"])) {
            return undefined;
        }

        return JSON.parse(text, fn);
    }

    public static stripComments(value: string) {
        value = stringifyVar(value);

        const tokenizer = /"|(?:\/\*)|(?:\*\/)|(?:\/\/)|\n|\r/g;

        let inString = false;
        let lineComment = false;
        let multiComment = false;

        let pos = 0;

        const result = [];

        while (true) {
            const match = tokenizer.exec(value);
            if (!match) {
                break;
            }
            const left = value.substring(0, match.index);
            const text = match[0];

            if (!lineComment && !multiComment) {
                let tmp = left.substring(pos);
                if (!inString) {
                    tmp = tmp.replace(/(\n|\r|\s)*/g, "");
                }
                result.push(tmp);
            }

            pos = tokenizer.lastIndex;

            if (text === "\"" && !lineComment && !multiComment) {
                const tmp = left.match(/(\\)*$/);
                // start of string with ", or unescaped " character found to end string
                if (!inString || !tmp || (tmp[0].length % 2) === 0) {
                    inString = !inString;
                }
                pos--; // include " character in next catch
            } else if (text === "/*" && !inString && !lineComment && !multiComment) {
                lineComment = true;
            } else if (text === "*/" && !inString && lineComment && !multiComment) {
                lineComment = false;
            } else if (text === "//" && !inString && !lineComment && !multiComment) {
                multiComment = true;
            } else if ((text === "\n" || text === "\r") && !inString && !lineComment && multiComment) {
                multiComment = false;
            } else if (!lineComment && !multiComment && !(/\n|\r|\s/.test(text))) {
                result.push(text);
            }
        }
        result.push(value.substring(pos));
        return result.join("");
    }
}
