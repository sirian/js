import {stringifyVar} from "./Stringify";

const escapeRe = /[|\\{}()[\]^$+*?.]/g;

export const rgxEscape = (str: string) => stringifyVar(str).replace(escapeRe, "\\$&");
