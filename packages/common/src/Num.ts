import {isEqualNaN} from "./Var";

export const toInt = (x: number) => Math.trunc(x);
export const toInt32 = (x: number) => x | 0;
export const toUint32 = (v: number) => v >>> 0;

export const parseNumber = (value?: boolean | string | number | null, defaultValue: number = NaN): number => {
    value ??= 0;

    switch (typeof value) {
        case "boolean":
        case "number":
        case "bigint":
        case "string":
            const x = +value;

            return isEqualNaN(x) ? defaultValue : x;
        default:
            return defaultValue;
    }
};

export const parseInt = (value?: boolean | string | number | null, defaultValue?: number) =>
    toInt(parseNumber(value, defaultValue));

export const isInt = (value: any): value is number => isFinite(value) && !(value % 1);

export const isFinite = (value: any): value is number => +value === value && value !== -(1 / 0) && value !== (1 / 0);

export const isInt32 = (value: any): value is number => toInt32(value) === value;
