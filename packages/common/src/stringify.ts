import {isNullish, isSymbol} from "./Is";

// eslint-disable-next-line @typescript-eslint/unbound-method
const objToString = ({}).toString;
// eslint-disable-next-line @typescript-eslint/unbound-method
const fnToString = (() => {}).toString;

export const stringifyObj = (v: any) => objToString.call(v);
export const stringifyFn = (v: any) => fnToString.call(v);

export const stringifyStr = String;

export const stringifyVar = (value: any) => isNullish(value) || isSymbol(value) ? "" : stringifyStr(value);
