import {TemplateStringsLike} from "@sirian/ts-extra-types";

export const stringifyTagString = (strings: TemplateStringsLike, ...values: any[]) =>
    Array.from(strings).reduce((res, str, i) => res + String(values[i - 1]) + str);
