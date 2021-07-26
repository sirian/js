import {Primitive} from "@sirian/ts-extra-types";
import {isNullish} from "./Is";
import {applyIfFunction} from "./Ref";
import {stringifyVar} from "./Stringify";
import {isError} from "./Var";

export type Throwable = Primitive | Error;

export type ThrowableProvider = () => Throwable;

export type AssertFunc = (e: any, err?: Throwable | ThrowableProvider, extra?: unknown) => asserts e;

export const assert: AssertFunc = (cond: unknown, err?: Throwable | ThrowableProvider, extra?: unknown) =>
    cond || throwError(makeError(err, extra));

export const ensureNotNull = <T>(cond: T, err?: Throwable | ThrowableProvider, extra?: unknown): NonNullable<T> =>
    cond ?? throwError(makeError(err, extra));

export const castError = (value: unknown) =>
    isError(value) ? value : new Error(stringifyVar(value)/*, {cause: value}*/); // todo

export const makeError = (value: Throwable | ThrowableProvider, extra?: unknown) =>
    Object.assign(castError(applyIfFunction(value)), isNullish(extra) ? {} : {extra});

export function throwError(err?: Throwable | ThrowableProvider, extra?: unknown): never {
    throw makeError(err, extra);
}
