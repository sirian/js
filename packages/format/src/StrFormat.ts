import {TagString, TemplateStringsLike} from "./TagString";

export class StrFormat {
    public static dedent(str: TemplateStringsLike, ...values: any[]) {
        const tpl = new TagString(str, values);

        const raw = tpl.raw.join(",");

        // count leading whitespaces in raw source
        const skipLeft = raw.match(/^[ \t]*\r?\n/);

        // count trailing whitespaces in raw source
        const skipRight = raw.match(/\r?\n[ \t]*$/);

        const strings = tpl.strings;

        if (skipLeft) {
            strings[0] = strings[0].substr(skipLeft[0].length);
        }

        if (skipRight) {
            const lastIndex = strings.length - 1;
            const last = strings[lastIndex];
            strings[lastIndex] = last.substr(0, last.length - skipRight[0].length);
        }

        const indents = raw
            .replace(/^[^\n]*[\n\S]/, "") // ignore first line
            .match(/^[ \t]*(?=\S)/gm);

        if (indents) {
            const indent = indents
                .map((s) => s.length)
                .reduce((a, b) => a < b ? a : b);

            if (indent > 0) {
                const re = new RegExp(`^[ \\t]{${indent}}`, "gm");

                for (let i = 0; i < strings.length; i++) {
                    strings[i] = strings[i].replace(re, "");
                }
            }
        }

        return tpl.toString();
    }
}
