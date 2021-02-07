import {noop} from "./Fn";

function helper(obj: { toString: () => string }) {
    const {toString} = obj;
    return (v: any) => toString.call(v);
}

export const stringifyObj = helper({});
export const stringifyFn = helper(noop);
