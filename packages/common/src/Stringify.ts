import {isSymbol} from "./Is";

const objToString = ({}).toString;
const fnToString = objToString.toString;
export const stringifyObj = (v: any) => objToString.call(v);
export const stringifyFn = (v: any) => fnToString.call(v);
export const stringifyStr = String;
export const stringifyVar = (value: any) => isSymbol(value) ? "" : stringifyStr(value ?? "");
