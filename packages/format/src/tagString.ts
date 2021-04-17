import {isObject} from "@sirian/common";
import {TemplateStringsLike} from "@sirian/ts-extra-types";
import {stringifyTagString} from "./stringifyTagString";

export interface TagString {
    strings: string[];
    raw: string[];
    values: any[];

    toString(): string;
}

export const tagString = (input: TemplateStringsLike, ...values: any[]): TagString =>
    isObject(input)
    ? ({
        strings: Array.from(input),
        raw: Array.from((input as any).raw ?? input),
        values,
        toString() {
            return stringifyTagString(this.strings, ...this.values);
        },
    })
    : tagString([input], ...values);
