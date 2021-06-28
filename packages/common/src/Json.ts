import {stringifyStr, stringifyVar} from "./Stringify";

export const jsonStringify = (value: any, ...args: any[]) => JSON.stringify(value ?? null, ...args);

export const jsonParse = (text?: string | null, fn?: (key: any, value: any) => any) => {
    if (null === text) {
        return null;
    }

    if (undefined === text || "" === text || "undefined" === text) {
        return undefined;
    }

    return JSON.parse(text, fn);
};

export const jsonStripComments = (value: string) => {
    value = stringifyVar(value);

    const tokenizer = /"|(?:\/\*)|(?:\*\/)|(?:\/\/)|\n|\r/g;

    let inString = false;
    let lineComment = false;
    let multiComment = false;

    let pos = 0;

    const result = [];

    // eslint-disable-next-line no-constant-condition
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
            const tmp = /(\\)*$/.exec(left);
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
};

export const quoteSingle = (str: any) => wrapQuotes(str, "'");

export const quoteBacktick = (str: any) => wrapQuotes(str, "`");

export const quoteDouble = (str: any) => wrapQuotes(str, "\"");

export const wrapQuotes = (str: any, quote: "'" | "\"" | "`") =>
    quote
    + jsonStringify(stringifyStr(str))
        .slice(1, -1)
        .replace(/\\"/g, "\"")
        .replaceAll(quote, "\\" + quote)
    + quote;
