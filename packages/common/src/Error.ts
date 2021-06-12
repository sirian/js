import {Primitive} from "@sirian/ts-extra-types";
import {isNullish, isPrimitive} from "./Is";
import {applyIfFunction} from "./Ref";
import {stringifyVar} from "./Stringify";

export type Throwable = Primitive | Error;

export type ThrowableProvider = () => Throwable;

export type AssertFunc = (e: any, err?: Throwable | ThrowableProvider, extra?: any) => asserts e;

export const assert: AssertFunc = (cond: any, err?: Throwable | ThrowableProvider, extra?: any) =>
    cond || throwError(makeError(err, extra));

export const ensureNotNull = <T>(cond: T, err?: Throwable | ThrowableProvider, extra?: any): NonNullable<T> =>
    cond ?? throwError(makeError(err, extra));

export const castError = (value: any) =>
    isPrimitive(value) ? new Error(stringifyVar(value)) : value;

export const makeError = (value: Throwable | ThrowableProvider, extra?: any) =>
    Object.assign(castError(applyIfFunction(value)), isNullish(extra) ? {} : {extra});

export function throwError(err?: Throwable | ThrowableProvider, extra?: any): never {
    throw makeError(err, extra);
}
