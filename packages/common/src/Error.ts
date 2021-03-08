import {Primitive} from "@sirian/ts-extra-types";
import {isNullish, isPrimitive} from "./Is";
import {stringifyVar} from "./Stringify";

export type Throwable = Primitive | Error;
export type AssertFunc = (e: any, err?: Throwable, extra?: any) => asserts e;

export const assert: AssertFunc = (cond: any, err?: Throwable, extra?: any) =>
    cond || throwError(makeError(err, extra));

export const ensureNotNull = <T>(cond: T, err?: Throwable, extra?: any): NonNullable<T> =>
    cond ?? throwError(makeError(err, extra));

export const castError = (value: any) => isPrimitive(value) ? new Error(stringifyVar(value)) : value;

export const makeError = (value: any, extra?: any) =>
    Object.assign(castError(value), isNullish(extra) ? {} : {extra});

export function throwError(err?: Throwable, extra?: any): never {
    throw makeError(err, extra);
}
