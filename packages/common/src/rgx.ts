import {stringifyVar} from "./stringify";

const escapeRe = /[$()*+.?[\\\]^{|}]/g;

export const rgxEscape = (str: string) => stringifyVar(str).replace(escapeRe, "\\$&");
