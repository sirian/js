import {Var} from "./Var";

const Inf = 1 / 0;

export const Num = new class {
    public parse(value?: boolean | string | number | null, defaultValue: number = NaN): number {
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

    public parseInt(value?: boolean | string | number | null, defaultValue?: number) {
        return Num.toInt(Num.parse(value, defaultValue));
    }

    public toInt(x: number) {
        return Math.trunc(x);
    }

    public toInt32(x: number) {
        return x | 0;
    }

    public toUint32(v: number) {
        return v >>> 0;
    }

    public isInt(value: any): value is number {
        return Num.isFinite(value) && !(value % 1);
    }

    public isFinite(value: any): value is number {
        return +value === value && value !== -Inf && value !== Inf;
    }

    public isInt32(value: any): value is number {
        return Num.toInt32(value) === value;
    }
};
