import {Primitive} from "@sirian/ts-extra-types";
import {isPrimitive} from "./Is";
import {stringifyVar} from "./Stringify";

export type Throwable = Primitive | Error;
export type AssertFunc = (e: any, err?: Throwable, extra?: any) => asserts e;

export const assert: AssertFunc = (cond: any, err?: Throwable, extra?: any) =>
    cond || throwError(makeError(err, extra));

export const ensureNotNull = <T>(cond: T, err?: Throwable, extra?: any): NonNullable<T> =>
    cond ?? throwError(makeError(err, extra));

export const makeError = <T, E>(value: T, extra?: E) =>
    Object.assign(isPrimitive(value) ? new Error(stringifyVar(value)) : value, {extra}) as
        (T extends Primitive ? Error : T) & { extra: E };

export function throwError(err?: Throwable): never {
    throw makeError(err);
}
