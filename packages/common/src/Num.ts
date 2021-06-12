import {isNumber, isString} from "./Is";
import {ifEqualNaN} from "./Var";

export const SMALLEST_UNSAFE_INTEGER = 2 ** 53;
export const LARGEST_SAFE_INTEGER = 2 ** 53 - 1;
export const UINT32_SIZE = 2 ** 32;
export const UINT32_MAX = 2 ** 32 - 1;
export const INT32_SIZE = 2 ** 31;
export const INT32_MAX = 2 ** 31 - 1;
export const UINT21_SIZE = 2 ** 21;
export const UINT21_MAX = 2 ** 21 - 1;
export const BIG_UINT64_MAX = 2n ** 64n - 1n;

export const toInt = (x: number) => Math.trunc(x);
export const toInt32 = (x: number) => x | 0;
export const toUint32 = (v: number) => v >>> 0;
export const toBigInt = (x: number | bigint) => BigInt(x);
export const toBigUint64 = (x: number | bigint) => toBigInt(x) & BIG_UINT64_MAX;

export const parseNumber = (x?: boolean | string | number | null, defaultValue: number = NaN): number =>
    ifEqualNaN(+(x ?? 0), defaultValue);

export const parseInt = (x?: boolean | string | number | null, defaultValue?: number) =>
    toInt(parseNumber(x, defaultValue));

export const isFloat = (x: any) => isFinite(x) && !!(x % 1);

export const isInt = (x: any): x is number => isFinite(x) && !(x % 1);

export const isFinite = (x: any): x is number => (+x === x) && (-1 / 0 !== x) && (1 / 0 !== x);

export const isInt32 = (x: any): x is number => toInt32(x) === x;

export const isNumeric = (value: any): value is string | number =>
    isNumber(value) ? isFinite(value) : isString(value) && isFinite(+value - parseFloat(value));
