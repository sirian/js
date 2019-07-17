import {Arr, Str, Unicode, Var} from "@sirian/common";

export class StrUtil {
    public static stripTags(text: string) {
        return text.replace(/<\/?[^>]+>/g, "");
    }

    public static spaces(length: number) {
        return length > 0 ? " ".repeat(length) : "";
    }

    public static width(str?: number | string | undefined) {
        return Unicode.getGraphemes(Var.stringify(str)).length;
    }

    public static splitByWidth(str: string, width: number) {
        str = Var.stringify(str);
        if (this.width(str) <= width) {
            return [str];
        }

        const graphemes = Unicode.getGraphemes(str);

        return Arr.chunk(graphemes, width)
            .map((a) => Str.padRight(a.join(""), width, " "));
    }
}
