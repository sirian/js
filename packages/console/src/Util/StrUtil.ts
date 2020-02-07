import {Arr, Str, stringifyVar, Unicode} from "@sirian/common";

export class StrUtil {
    public static stripTags(text: string) {
        return text.replace(/<\/?[^>]+>/g, "");
    }

    public static spaces(length: number) {
        return length > 0 ? " ".repeat(length) : "";
    }

    public static width(str?: number | string | undefined) {
        return Unicode.getGraphemes(stringifyVar(str)).length;
    }

    public static splitByWidth(str: string, width: number) {
        str = stringifyVar(str);
        if (this.width(str) <= width) {
            return [str];
        }

        const graphemes = Unicode.getGraphemes(str);

        return Arr.chunk(graphemes, width)
            .map((a) => Str.padRight(a.join(""), width, " "));
    }
}
