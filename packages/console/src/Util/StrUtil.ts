import {arrChunk, padRight, stringifyVar} from "@sirian/common";

export class StrUtil {
    public static stripTags(text: string) {
        return text.replace(/<\/?[^>]+>/g, "");
    }

    public static spaces(length: number) {
        return length > 0 ? " ".repeat(length) : "";
    }

    public static width(str?: number | string | undefined) {
        return StrUtil.getGraphemes(str).length;
    }

    public static splitByWidth(str: string, width: number) {
        str = stringifyVar(str);
        if (this.width(str) <= width) {
            return [str];
        }

        const graphemes = StrUtil.getGraphemes(str);

        return arrChunk(graphemes, width)
            .map((a) => padRight(a.join(""), width, " "));
    }

    public static getGraphemes(str: any) {
        return stringifyVar(str).match(/(\P{M}\p{M}*)/gu) || [];
    }
}
