import {TemplateStringsLike} from "@sirian/ts-extra-types";
import {tagString} from "./tagString";

export const dedent = (str: TemplateStringsLike, ...values: any[]) => {
    const t = tagString(str, ...values);

    const raw = t.raw.join(",");
    const strings = t.strings;

    // count leading whitespaces in raw source
    const skipLeft = /^[\t ]*\r?\n/.exec(raw);

    // count trailing whitespaces in raw source
    const skipRight = /\r?\n[\t ]*$/.exec(raw);

    if (skipLeft) {
        strings[0] = strings[0].slice(skipLeft[0].length);
    }

    if (skipRight) {
        const lastIndex = strings.length - 1;
        strings[lastIndex] = strings[lastIndex].slice(0, -skipRight[0].length);
    }

    const indent = raw
        .replace(/^[^\n]*[\S\n]/, "") // ignore first line
        .match(/^[\t ]*(?=\S)/gm)
        ?.map((s) => s.length)
        ?.reduce((a, b) => a < b ? a : b)
    ;

    if (indent) {
        const re = new RegExp(`^[ \\t]{${indent}}`, "gm");
        t.strings = strings.map((s) => s.replace(re, ""));
    }

    return "" + t;
};
