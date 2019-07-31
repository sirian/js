import {Var} from "@sirian/common";
import {RuntimeError} from "@sirian/console";
import {NativeMathSource} from "./NativeMathSource";

export interface IRandomSource {
    uint8(): number;
}

export class Random {
    protected readonly source: IRandomSource;
    protected maxAttempts = 64;

    constructor(source?: IRandomSource) {
        this.source = source || new NativeMathSource();
    }

    public real(min: number, max: number, bits: number = 32) {
        if (!isFinite(min) || !isFinite(max)) {
            throw new RangeError(`Expected [min, max] to be a finite numbers. Given [${min}, ${max}]`);
        }

        const delta = max - min;

        const real01 = this.uint(bits) / 2 ** bits;

        return min + delta * real01;
    }

    public real01(bits: number = 32) {
        return this.uint(bits) / (2 ** bits);
    }

    public integer(min: number, max: number) {
        const iMin = Math.ceil(min);
        const iMax = Math.floor(max);

        const range = iMax - iMin + 1;

        if (!Var.isBetween(range, 1, 2 ** 53 - 1)) {
            throw new RangeError(`Invalid integer range [${min}, ${max}]`);
        }

        const bytes = Math.ceil(Math.log2(range) / 8);

        if (!bytes) {
            return iMin;
        }

        const maxNum = 256 ** bytes;

        const {maxAttempts, source} = this;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            let val = 0;

            for (let i = 0; i < bytes; i++) {
                const uint8 = (source.uint8() >>> 0) % 256;
                val = (val << 8) + uint8;
            }

            if (val < maxNum - maxNum % range) {
                return iMin + (val % range);
            }
        }

        throw new RuntimeError(`Random integer generation [${min}, ${max}] failed after ${maxAttempts} attempts`);
    }

    public uuid4() {
        const tpl = "10000000-1000-4000-8000-100000000000";
        return tpl.replace(/[018]/g, (x) => {
            const shift = +x / 4;
            const y = this.uint(4) >> shift;
            const v = +x ^ y;
            return v.toString(16);
        });
    }

    public shuffle<T extends any[]>(array: T): T {
        for (let i = array.length - 1; i > 0; --i) {
            const j = this.integer(0, i);
            if (i === j) {
                continue;
            }
            const tmp = array[i];
            array[i] = array[j];
            array[j] = tmp;
        }
        return array;
    }

    public int(bits: number) {
        const x = 2 ** (bits - 1);
        return this.integer(-x, x - 1);
    }

    public uint(bits: number) {
        return this.integer(0, 2 ** bits - 1);
    }
}
