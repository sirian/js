import {isNumber, isString} from "./Is";
import {ifEqualNaN} from "./Var";

export const INT32_SIZE = 2 ** 31;
export const INT32_MAX = INT32_SIZE - 1;
export const UINT32_SIZE = INT32_SIZE * 2;
export const UINT32_MAX = UINT32_SIZE - 1;
export const UINT21_SIZE = 2 ** 21;
export const UINT21_MAX = UINT21_SIZE - 1;
export const BIG_UINT64_SIZE = 2n ** 64n;
export const BIG_UINT64_MAX = BIG_UINT64_SIZE - 1n;
export const BIG_UINT32_SIZE = 2n ** 32n;
export const BIG_UINT32_MAX = BIG_UINT32_SIZE - 1n;

export const toNumber = (x: number | bigint) => Number(x);
export const toInt = (x: number) => Math.trunc(x);
export const toInt32 = (x: number) => x | 0; // eslint-disable-line unicorn/prefer-math-trunc
export const toUint32 = (v: number) => v >>> 0;
export const toBigInt = (x: number | bigint) => BigInt(x);
export const toBigUint64 = (x: number | bigint) => toBigInt(x) & BIG_UINT64_MAX;
export const toBigUint32 = (x: number | bigint) => toBigInt(x) & BIG_UINT32_MAX;

export const parseNumber = (x?: boolean | string | number | null, defaultValue = NaN): number =>
    ifEqualNaN(+(x ?? 0), defaultValue);

export const parseInt = (x?: boolean | string | number | null, defaultValue?: number) =>
    toInt(parseNumber(x, defaultValue));

export const isFloat = (x: any) => isFinite(x) && !!(x % 1);

export const isInt = (x: any): x is number => isFinite(x) && !(x % 1);

export const isFinite = (x: any): x is number => (+x === x) && (-1 / 0 !== x) && (1 / 0 !== x);

export const isInt32 = (x: any): x is number => toInt32(x) === x;

export const isNumeric = (value: any): value is string | number =>
    isNumber(value) ? isFinite(value) : isString(value) && isFinite(+value - parseFloat(value));
