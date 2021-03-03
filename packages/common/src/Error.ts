import {isPrimitive} from "./Is";
import {stringifyVar} from "./Stringify";

export type Throwable = string | Error;
export type AssertFunc = (e: any, err?: Throwable) => asserts e;

export const assert: AssertFunc = (cond: any, err?: Throwable) => cond || throwError(err);
export const ensureNotNull = <T>(cond: T, err?: Throwable): NonNullable<T> => cond ?? throwError(err);

export const makeError = <T>(value: T) => isPrimitive(value) ? new Error(stringifyVar(value)) : value;

export function throwError(err?: Throwable): never {
    throw makeError(err);
}
