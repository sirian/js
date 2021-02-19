import {isSymbol} from "./Is";

export const stringifyObj = (v: any) => ({}).toString.call(v);
export const stringifyFn = (v: any) => stringifyFn.toString.call(v);
export const stringifyStr = (value: any) => String(value);
export const stringifyVar = (value: any) => stringifyStr(isSymbol(value) ? "" : (value ?? ""));
