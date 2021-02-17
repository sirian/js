import {noop} from "./Fn";
import {isNullish, isSymbol} from "./Is";

type ToStringAware = { toString: () => string };

const helper = ({toString}: ToStringAware) => (v: any) => toString.call(v);
export const stringifyObj = helper({});
export const stringifyFn = helper(noop);
export const stringifyVar = (value: any) => isNullish(value) || isSymbol(value) ? "" : "" + value;
