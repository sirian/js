import {global} from "./global";
import {Var} from "./Var";

const Math = global.Math;

const Inf = 1 / 0;

export class Num {
    public static parse(value?: boolean | string | number | null, defaultValue: number = NaN): number {
        if (Var.isNullable(value)) {
            return 0;
        }

        switch (typeof value) {
            case "boolean":
            case "number":
            case "string":
                const x = +value;

                return x === x ? x : defaultValue;
            default:
                return defaultValue;
        }
    }

    public static parseInt(value?: boolean | string | number | null, defaultValue?: number) {
        return Num.toInt(Num.parse(value, defaultValue));
    }

    public static toInt(x: number) {
        return Math.trunc(x);
    }

    public static toInt32(x: number) {
        return x | 0;
    }

    public static toUint32(v: number) {
        return v >>> 0;
    }

    public static isInt(value: any): value is number {
        return Num.isFinite(value) && !(value % 1);
    }

    public static isFinite(value: any): value is number {
        return +value === value && value !== -Inf && value !== Inf;
    }

    public static isInt32(value: any): value is number {
        return Num.toInt32(value) === value;
    }
}