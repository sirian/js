import {sprintf} from "@sirian/common";

export class Units {
    public static readonly bytes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    public value: number;
    public unit: string;

    constructor(value: number, unit: string) {
        this.value = value;
        this.unit = unit;
    }

    public static from(value: number, k: number, units: string[]) {
        value = +value || 0;

        if (!value) {
            return new Units(value, units[0]);
        }

        const pow = this.getPower(value, k);

        const unitValue = value / (k ** pow);

        return new Units(unitValue, units[pow]);
    }

    public static getPower(value: number, k: number) {
        if (!value) {
            return 0;
        }

        const abs = Math.abs(value);

        return Math.trunc(Math.log(abs) / Math.log(k));
    }

    public static formatBytes(value: number, template?: string) {
        return this.format(value, 1024, this.bytes, template);
    }

    public static format(value: number, k: number, units: string[], template?: string) {
        return this.from(value, k, units).format(template);
    }

    public format(template: string = "%.2f  %s") {
        return sprintf(template, this.value, this.unit);
    }
}
