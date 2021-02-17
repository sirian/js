import {noop} from "./Const";
import {isNullish, isSymbol} from "./Is";

type ToStringAware = { toString: () => string };

const helper = ({toString}: ToStringAware) => (v: any) => toString.call(v);
export const stringifyObj = helper({});
export const stringifyFn = helper(noop);
export const stringifyStr = (value: any) => String(value);
export const stringifyVar = (value: any) => isNullish(value) || isSymbol(value) ? "" : "" + value;
